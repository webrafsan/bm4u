import { NextRequest, NextResponse } from 'next/server';
import { getPostsCollection } from '@/lib/db';
import { POSTS } from '@/data/posts';
import { BlogPost } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const postsCol = await getPostsCollection();
    let posts = await postsCol.find({}).sort({ publishedTime: -1, createdAt: -1 }).toArray();

    // Auto-seed if database is empty on first query
    if (posts.length === 0) {
      const docs = POSTS.map(p => ({
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      await postsCol.insertMany(docs);
      posts = await postsCol.find({}).sort({ publishedTime: -1, createdAt: -1 }).toArray();
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const q = searchParams.get('q')?.toLowerCase();

    let filtered = posts;

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (tag && tag !== 'All') {
      filtered = filtered.filter(p => 
        Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (q) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
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

    // Normalize tags
    let tagsArray: string[] = [];
    if (Array.isArray(body.tags)) {
      tagsArray = body.tags.map((t: string) => String(t).trim()).filter(Boolean);
    } else if (typeof body.tags === 'string') {
      tagsArray = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    // Normalize author
    const author = {
      name: body.author?.name || body.authorName || 'BM4U Asset Team',
      role: body.author?.role || body.authorRole || 'Senior Media Buying Architect',
      avatar: body.author?.avatar || undefined,
    };

    // Normalize content
    let contentArray: string[] = [];
    if (Array.isArray(body.content)) {
      contentArray = body.content.map((c: string) => String(c).trim()).filter(Boolean);
    } else if (typeof body.content === 'string') {
      contentArray = body.content.split('\n\n').map((c: string) => c.trim()).filter(Boolean);
    }

    const now = new Date().toISOString();
    const dateFormatted = body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newPost: BlogPost & { createdAt: string; updatedAt: string } = {
      slug: finalSlug,
      title: body.title,
      metaTitle: body.metaTitle || `${body.title} | BM Shop Tips`,
      metaDescription: body.metaDescription || body.excerpt || '',
      date: dateFormatted,
      publishedTime: body.publishedTime || now,
      modifiedTime: now,
      readTime: body.readTime || '4 min read',
      excerpt: body.excerpt || '',
      content: contentArray,
      category: body.category || 'Guides',
      image: body.image || '/tips/facebook-bm2500-guide.svg',
      imageAlt: body.imageAlt || body.title,
      tags: tagsArray.length > 0 ? tagsArray : ['Meta Ads', 'Guides'],
      author,
      relatedProductSlug: body.relatedProductSlug || undefined,
      createdAt: now,
      updatedAt: now,
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
