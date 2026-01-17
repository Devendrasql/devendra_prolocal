// app/api/blog/route.ts

export const runtime = "nodejs";
console.log("✅ /api/blog route loaded");

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   CREATE BLOG POST (ADMIN)
========================= */
export async function POST(req: Request) {
  console.log("🔥 POST /api/blog HIT");

  /* ======================
     1️⃣ Admin authorization
  ====================== */
  const denied = await adminGuard(req);
  if (denied) return denied;

  /* ======================
     2️⃣ Parse JSON body SAFELY
  ====================== */
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
    slug,
    excerpt,
    content,
    coverImage,
    author,
    published,
    readTime,
    tags,
  } = body;

  /* ======================
     3️⃣ Validate required fields
  ====================== */
  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  /* ======================
     4️⃣ Normalize tags
  ====================== */
  const safeTags: string[] = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : [];

  /* ======================
     5️⃣ Create blog post
  ====================== */
  const blogPost = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author: author || "Admin",
      published: published ?? false,
      readTime: readTime || 5,
      tags: {
        create: safeTags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(blogPost, { status: 201 });
}

/* =========================
   LIST BLOG POSTS (PUBLIC)
========================= */
export async function GET(req: Request) {
  /* ======================
     6️⃣ Parse query params
  ====================== */
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published") === "true";

  /* ======================
     7️⃣ Build where clause
  ====================== */
  const where: any = {};
  if (published) where.published = true;

  /* ======================
     8️⃣ Fetch blog posts
  ====================== */
  const posts = await prisma.blogPost.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /* ======================
     9️⃣ Return clean response
  ====================== */
  return NextResponse.json({
    data: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      cover_image: post.coverImage,
      author: post.author,
      tags: post.tags.map((t) => t.tag.name),
      published: post.published,
      views: post.views,
      read_time: post.readTime,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
    })),
  });
}
