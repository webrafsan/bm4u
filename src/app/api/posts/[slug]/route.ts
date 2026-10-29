import { NextRequest, NextResponse } from 'next/server';
import { getPostsCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const postsCol = await getPostsCollection();

    let query: any = { slug };
    if (ObjectId.isValid(slug)) {
      query = { $or: [{ slug }, { _id: new ObjectId(slug) }] };
    }

    const post = await postsCol.findOne(query);

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const postsCol = await getPostsCollection();

    let query: any = { slug };
    if (ObjectId.isValid(slug)) {
      query = { $or: [{ slug }, { _id: new ObjectId(slug) }] };
    }

    const updateData: any = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    delete updateData._id;

    if (updateData.content && !Array.isArray(updateData.content)) {
      updateData.content = updateData.content.split('\n\n').filter(Boolean);
    }

    const result = await postsCol.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      data: result,
    });
  } catch (err: any) {
    console.error('Update post error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const postsCol = await getPostsCollection();

    let query: any = { slug };
    if (ObjectId.isValid(slug)) {
      query = { $or: [{ slug }, { _id: new ObjectId(slug) }] };
    }

    const result = await postsCol.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
