import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');

    // Fast path for slug uniqueness checks
    if (slug) {
      const products = await Product.find({ slug }).select('_id slug');
      return NextResponse.json(products);
    }

    let query: any = { isActive: true };

    if (category) query.categoryId = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).select('_id name slug description price compareAtPrice unit stockQuantity sku images isFeatured').sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Creating product - images received:', body.images?.length || 0);
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (!body.slug) {
      return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
    }
    if (!body.description) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 });
    }
    if (!body.sku) {
      return NextResponse.json({ error: 'Product SKU is required' }, { status: 400 });
    }
    if (body.price === undefined || body.price === null) {
      return NextResponse.json({ error: 'Product price is required' }, { status: 400 });
    }
    
    // Check for duplicate slug
    const existingSlug = await Product.findOne({ slug: body.slug });
    if (existingSlug) {
      return NextResponse.json({ error: 'Product slug already exists' }, { status: 400 });
    }
    
    // Check for duplicate SKU
    const existingSku = await Product.findOne({ sku: body.sku });
    if (existingSku) {
      return NextResponse.json({ error: 'Product SKU already exists' }, { status: 400 });
    }
    
    // Validate categoryId if provided
    if (body.categoryId) {
      try {
        // Test if it's a valid ObjectId format
        const { ObjectId } = require('mongodb');
        new ObjectId(body.categoryId);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid category ID format' }, { status: 400 });
      }
    }
    
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json({ error: `${field} already exists` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
