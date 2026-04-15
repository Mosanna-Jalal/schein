import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAdminFromRequest } from '@/lib/auth';
import { fetchDummyProductById } from '@/lib/demoProducts';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const demo = searchParams.get('demo') === 'true' || String(id).startsWith('demo-');

    if (demo) {
      const product = await fetchDummyProductById(id);
      if (!product) {
        return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return Response.json({ success: true, product, source: 'dummyjson' });
    }

    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    // Increment views
    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return Response.json({ success: true, product });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return Response.json({ success: true, product });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
