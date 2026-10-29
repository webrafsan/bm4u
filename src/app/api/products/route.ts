import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/db';
import { PRODUCTS } from '@/data/products';

export async function GET(req: NextRequest) {
  try {
    const productsCol = await getProductsCollection();
    let products = await productsCol.find({}).toArray();

    // Auto-seed if database is empty on first query
    if (products.length === 0) {
      const docs = PRODUCTS.map(p => ({
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      await productsCol.insertMany(docs);
      products = await productsCol.find({}).toArray();
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const q = searchParams.get('q')?.toLowerCase();

    let filtered = products;

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (country && country !== 'all') {
      filtered = filtered.filter(p => p.country === country);
    }

    if (q) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(q) ||
        p.country?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err: any) {
    console.error('Fetch products error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title, price, and category are required.' },
        { status: 400 }
      );
    }

    const productsCol = await getProductsCollection();

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = body.id || `prod-${Date.now()}`;

    // Check if duplicate slug or id
    const existing = await productsCol.findOne({ $or: [{ slug }, { id }] });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    const finalId = existing ? `${id}-${Date.now()}` : id;

    const newProduct = {
      id: finalId,
      slug: finalSlug,
      title: body.title,
      category: body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      country: body.country || 'Global',
      countryCode: body.countryCode || 'UN',
      lines: body.lines || 'n/a',
      limit: body.limit || 'Unlimited',
      format: body.format || 'UID|PASS|2FA|MAIL',
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      features: Array.isArray(body.features) 
        ? body.features 
        : (body.features ? body.features.split('\n').filter(Boolean) : ['Instant Delivery', '24h Replacement']),
      description: body.description || '',
      guarantee: body.guarantee || '24 Hours Replacement Guarantee',
      isPopular: Boolean(body.isPopular),
      isSpecial: Boolean(body.isSpecial),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await productsCol.insertOne(newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: { ...newProduct, _id: result.insertedId },
    }, { status: 201 });
  } catch (err: any) {
    console.error('Create product error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
