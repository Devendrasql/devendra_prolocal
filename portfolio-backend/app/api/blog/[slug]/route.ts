// app/api/blog/[slug]/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   GET BLOG POST BY SLUG (PUBLIC)
========================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    return NextResponse.json(
      { error: "Blog post not found" },
      { status: 404 }
    );
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json({
    data: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      author: post.author,
      tags: post.tags.map((t) => t.tag.name),
      published: post.published,
      views: post.views + 1,
      read_time: post.readTime,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
    },
  });
}

/* =========================
   UPDATE BLOG POST (ADMIN)
========================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const { slug } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const {
    title,
    excerpt,
    content,
    coverImage,
    author,
    published,
    readTime,
    tags,
  } = body;

  const safeTags: string[] = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : [];

  const post = await prisma.blogPost.update({
    where: { slug },
    data: {
      ...(title && { title }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(author && { author }),
      ...(published !== undefined && { published }),
      ...(readTime !== undefined && { readTime }),
      ...(safeTags.length > 0 && {
        tags: {
          deleteMany: {},
          create: safeTags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      }),
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json({ data: post });
}

/* =========================
   DELETE BLOG POST (ADMIN)
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const { slug } = await params;

  await prisma.blogPost.delete({
    where: { slug },
  });

  return NextResponse.json({ success: true });
}
