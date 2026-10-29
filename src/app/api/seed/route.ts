import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection, getPostsCollection } from '@/lib/db';
import { PRODUCTS } from '@/data/products';
import { POSTS } from '@/data/posts';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';
    const type = searchParams.get('type') || 'all'; // 'products' | 'posts' | 'all'

    const results: Record<string, any> = {};

    // 1. Seed Products if requested
    if (type === 'all' || type === 'products') {
      const productsCol = await getProductsCollection();
      const pCount = await productsCol.countDocuments();

      if (pCount > 0 && !force) {
        results.products = {
          skipped: true,
          count: pCount,
          message: `Already has ${pCount} products. Use force=true to overwrite.`,
        };
      } else {
        if (force) {
          await productsCol.deleteMany({});
        }
        const pDocs = PRODUCTS.map(p => ({
          ...p,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }));
        const pResult = await productsCol.insertMany(pDocs);
        results.products = {
          success: true,
          count: pResult.insertedCount,
          message: `Seeded ${pResult.insertedCount} products.`,
        };
      }
    }

    // 2. Seed Posts / Tips if requested
    if (type === 'all' || type === 'posts') {
      const postsCol = await getPostsCollection();
      const postCount = await postsCol.countDocuments();

      if (postCount > 0 && !force) {
        results.posts = {
          skipped: true,
          count: postCount,
          message: `Already has ${postCount} posts. Use force=true to overwrite.`,
        };
      } else {
        if (force) {
          await postsCol.deleteMany({});
        }
        const postDocs = POSTS.map(p => ({
          ...p,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }));
        const postResult = await postsCol.insertMany(postDocs);
        results.posts = {
          success: true,
          count: postResult.insertedCount,
          message: `Seeded ${postResult.insertedCount} blog guide tips into MongoDB.`,
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed operation completed successfully.',
      results,
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to seed data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const productsCol = await getProductsCollection();
    const postsCol = await getPostsCollection();

    const [productCount, postCount] = await Promise.all([
      productsCol.countDocuments(),
      postsCol.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      products: { count: productCount, status: productCount > 0 ? 'seeded' : 'empty' },
      posts: { count: postCount, status: postCount > 0 ? 'seeded' : 'empty' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
