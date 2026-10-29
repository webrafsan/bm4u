import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/db';
import { PRODUCTS } from '@/data/products';

export async function POST(req: NextRequest) {
  try {
    const productsCol = await getProductsCollection();
    const count = await productsCol.countDocuments();
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    if (count > 0 && !force) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${count} products. Use ?force=true to overwrite.`,
        count,
      });
    }

    if (force) {
      await productsCol.deleteMany({});
    }

    const docs = PRODUCTS.map(p => ({
      ...p,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }));

    const result = await productsCol.insertMany(docs);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} products into MongoDB!`,
      count: result.insertedCount,
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to seed products' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const productsCol = await getProductsCollection();
    const count = await productsCol.countDocuments();
    return NextResponse.json({
      success: true,
      count,
      status: count > 0 ? 'seeded' : 'empty',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
