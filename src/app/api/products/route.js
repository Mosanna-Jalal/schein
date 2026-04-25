import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAdminFromRequest } from '@/lib/auth';
import { fetchDummyProducts } from '@/lib/demoProducts';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const demo = searchParams.get('demo') === 'true';

    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    const merged = searchParams.get('merged') === 'true';

    if (demo && !merged) {
      const products = await fetchDummyProducts({
        category: category || 'All',
        featured: featured === 'true',
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
        order,
      });
      return Response.json({ success: true, products, source: 'dummyjson' });
    }

    await connectDB();

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const dbProducts = await Product.find(filter).sort({ [sort]: order === 'asc' ? 1 : -1 }).lean();

    if (merged) {
      // Fetch demo products and append after DB products
      const demoProducts = await fetchDummyProducts({
        category: category || 'All',
        featured: featured === 'true',
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
        order,
      });
      // Exclude demo products whose names clash with DB products
      const dbNames = new Set(dbProducts.map((p) => p.name.toLowerCase()));
      const filtered = demoProducts.filter((p) => !dbNames.has(p.name.toLowerCase()));
      return Response.json({ success: true, products: [...dbProducts, ...filtered], source: 'merged' });
    }

    return Response.json({ success: true, products: dbProducts });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return Response.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
