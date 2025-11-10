import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const folder = process.env.CLOUDINARY_FOLDER || 'products';

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: 'Cloudinary environment variables missing' }, { status: 500 });
    }

    const file = form.get('file') as File | string | null;
    const resourceType = (form.get('resource_type') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const cloudForm = new FormData();
    cloudForm.append('upload_preset', uploadPreset);
    cloudForm.append('folder', folder);
    // Pass through either a File or a remote URL string
    cloudForm.append('file', file as any);

    const res = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudForm,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'Cloudinary upload failed' }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url, public_id: data.public_id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

