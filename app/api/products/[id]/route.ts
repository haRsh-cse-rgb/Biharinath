import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).populate('categoryId');
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Updating product - images received:', body.images?.length || 0);
    
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    console.log('Product updated - images saved:', product.images?.length || 0);
    
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
