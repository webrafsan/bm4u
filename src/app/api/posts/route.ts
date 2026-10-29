import { NextRequest, NextResponse } from 'next/server';
import { getPostsCollection } from '@/lib/db';
import { POSTS } from '@/data/posts';
import { BlogPost } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const postsCol = await getPostsCollection();
    let posts = await postsCol.find({}).sort({ createdAt: -1 }).toArray();

    // Auto-seed if database is empty on first query
    if (posts.length === 0) {
      const docs = POSTS.map(p => ({
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      await postsCol.insertMany(docs);
      posts = await postsCol.find({}).sort({ createdAt: -1 }).toArray();
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let filtered = posts;
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (q) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err: any) {
    console.error('Fetch posts error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Title is required.' },
        { status: 400 }
      );
    }

    const postsCol = await getPostsCollection();

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await postsCol.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const newPost: BlogPost & { createdAt: string; updatedAt: string } = {
      slug: finalSlug,
      title: body.title,
      category: body.category || 'Guides',
      readTime: body.readTime || '4 min read',
      date: body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      excerpt: body.excerpt || '',
      content: Array.isArray(body.content) 
        ? body.content 
        : (body.content ? body.content.split('\n\n').filter(Boolean) : []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await postsCol.insertOne(newPost);

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: { ...newPost, _id: result.insertedId },
    }, { status: 201 });
  } catch (err: any) {
    console.error('Create post error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
