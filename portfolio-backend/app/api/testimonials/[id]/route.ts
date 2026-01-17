// app/api/testimonials/[id]/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   GET TESTIMONIAL BY ID (PUBLIC)
========================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const testimonialId = parseInt(id, 10);

  if (isNaN(testimonialId)) {
    return NextResponse.json(
      { error: "Invalid testimonial ID" },
      { status: 400 }
    );
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id: testimonialId },
  });

  if (!testimonial) {
    return NextResponse.json(
      { error: "Testimonial not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: {
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      avatar_url: testimonial.avatarUrl,
      rating: testimonial.rating,
      featured: testimonial.featured,
    },
  });
}

/* =========================
   UPDATE TESTIMONIAL (ADMIN)
========================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const { id } = await params;
  const testimonialId = parseInt(id, 10);

  if (isNaN(testimonialId)) {
    return NextResponse.json(
      { error: "Invalid testimonial ID" },
      { status: 400 }
    );
  }

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
    name,
    role,
    company,
    content,
    avatarUrl,
    rating,
    featured,
  } = body;

  const testimonial = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: {
      ...(name && { name }),
      ...(role && { role }),
      ...(company && { company }),
      ...(content && { content }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(rating !== undefined && { rating }),
      ...(featured !== undefined && { featured }),
    },
  });

  return NextResponse.json({ data: testimonial });
}

/* =========================
   DELETE TESTIMONIAL (ADMIN)
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const { id } = await params;
  const testimonialId = parseInt(id, 10);

  if (isNaN(testimonialId)) {
    return NextResponse.json(
      { error: "Invalid testimonial ID" },
      { status: 400 }
    );
  }

  await prisma.testimonial.delete({
    where: { id: testimonialId },
  });

  return NextResponse.json({ success: true });
}
