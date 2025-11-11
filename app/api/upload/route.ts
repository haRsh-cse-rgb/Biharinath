import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_FOLDER || 'products';

    if (!cloudName) {
      return NextResponse.json({ 
        error: 'Cloudinary cloud name is missing. Please set CLOUDINARY_CLOUD_NAME in your environment variables.' 
      }, { status: 500 });
    }

    const file = form.get('file') as File | string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // If it's a string (URL), validate it and return directly
    if (typeof file === 'string') {
      try {
        new URL(file);
        return NextResponse.json({ url: file, public_id: null });
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }
    }

    // For file uploads, use Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const cloudForm = new FormData();
    
    if (uploadPreset) {
      // Use unsigned upload with preset (simpler method)
      cloudForm.append('upload_preset', uploadPreset);
      cloudForm.append('folder', folder);
    } else if (apiKey && apiSecret) {
      // Use signed upload with API key/secret
      const timestamp = Math.round(new Date().getTime() / 1000);
      const params: Record<string, string> = {
        folder: folder,
        timestamp: timestamp.toString(),
      };
      
      // Generate signature
      const paramsString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      const signature = crypto
        .createHash('sha1')
        .update(paramsString + apiSecret)
        .digest('hex');
      
      cloudForm.append('api_key', apiKey);
      cloudForm.append('timestamp', timestamp.toString());
      cloudForm.append('signature', signature);
      cloudForm.append('folder', folder);
    } else {
      return NextResponse.json({ 
        error: 'Cloudinary configuration missing. Please set either CLOUDINARY_UPLOAD_PRESET or both CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your environment variables.' 
      }, { status: 500 });
    }
    
    cloudForm.append('file', file);

    const res = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudForm,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Cloudinary upload error:', data);
      return NextResponse.json({ 
        error: data.error?.message || data.error || 'Cloudinary upload failed. Please check your configuration.' 
      }, { status: res.status || 500 });
    }

    if (!data.secure_url) {
      return NextResponse.json({ 
        error: 'Upload succeeded but no URL returned from Cloudinary' 
      }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url, public_id: data.public_id });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ 
      error: error.message || 'Upload failed. Please check your configuration and try again.' 
    }, { status: 500 });
  }
}

