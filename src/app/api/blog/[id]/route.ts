import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
        content: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (!post.published) {
      return NextResponse.json(
        { error: 'Blog post not available' },
        { status: 403 }
      );
    }

    // Transform content back to original format
    const transformedPost = {
      ...post,
      content: post.content.map(c => ({
        type: c.type,
        value: c.type === 'list' ? JSON.parse(c.value) : c.value
      }))
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
