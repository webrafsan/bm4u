import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getPostsCollection } from '@/lib/db';
import { POSTS } from '@/data/posts';

// Adds the posts from src/data/posts.ts that the database does not have yet.
// With ?force=true it also overwrites the stored copy of every post in that file, which resets
// any edits made in the admin to those posts - use it once after changing the static content.
export async function POST(req: NextRequest) {
  try {
    const force = new URL(req.url).searchParams.get('force') === 'true';
    const postsCol = await getPostsCollection();
    const now = new Date().toISOString();

    let inserted = 0;
    let updated = 0;

    for (const post of POSTS) {
      const existing = await postsCol.findOne({ slug: post.slug }, { projection: { _id: 1 } });
      if (!existing) {
        await postsCol.insertOne({ ...post, createdAt: now, updatedAt: now });
        inserted++;
      } else if (force) {
        await postsCol.updateOne({ slug: post.slug }, { $set: { ...post, updatedAt: now } });
        updated++;
      }
    }

    revalidateTag('posts', 'max');

    return NextResponse.json({
      success: true,
      message: `Posts seeded: ${inserted} inserted, ${updated} updated${force ? '' : ' (use ?force=true to overwrite existing)'}.`,
      inserted,
      updated,
    });
  } catch (err) {
    console.error('Seed posts error:', err);
    const message = err instanceof Error ? err.message : 'Failed to seed posts';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
