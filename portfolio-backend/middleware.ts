import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware purpose:
 * - Allow public access where intended
 * - DO NOT enforce admin auth here
 * - Admin auth is handled inside route handlers via adminGuard
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ======================
     Public API routes
  ====================== */

  // Auth routes
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/refresh")
  ) {
    return NextResponse.next();
  }

  // Public project reads
  if (
    req.method === "GET" &&
    pathname.startsWith("/api/projects")
  ) {
    return NextResponse.next();
  }

  // Public project view counter
  if (
    req.method === "POST" &&
    pathname.startsWith("/api/projects/") &&
    pathname.endsWith("/view")
  ) {
    return NextResponse.next();
  }

  /**
   * ❗ IMPORTANT:
   * We intentionally DO NOT block POST/PUT/DELETE here.
   * Admin authentication is enforced inside API routes
   * using adminGuard (cookie-based auth).
   */

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};












// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const ADMIN_METHODS = ["POST", "PUT", "DELETE"];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   /* ======================
//      Public routes
//   ====================== */

//   // Auth
//   if (
//     pathname.startsWith("/api/auth/login") ||
//     pathname.startsWith("/api/auth/refresh")
//   ) {
//     return NextResponse.next();
//   }

//   // Public project reads
//   if (
//     req.method === "GET" &&
//     pathname.startsWith("/api/projects")
//   ) {
//     return NextResponse.next();
//   }

//   // ✅ Public project view counter
//   if (
//     pathname.startsWith("/api/projects/") &&
//     pathname.endsWith("/view") &&
//     req.method === "POST"
//   ) {
//     return NextResponse.next();
//   }

//   /* ======================
//      Admin-protected routes
//   ====================== */

//   if (
//     pathname.startsWith("/api/projects") &&
//     ADMIN_METHODS.includes(req.method)
//   ) {
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.slice(7);

//     try {
//       const secret = new TextEncoder().encode(
//         process.env.JWT_ACCESS_SECRET!
//       );

//       const { payload } = await jwtVerify(token, secret);

//       if (payload.role !== "ADMIN") {
//         return NextResponse.json(
//           { error: "Forbidden" },
//           { status: 403 }
//         );
//       }

//       return NextResponse.next();
//     } catch {
//       return NextResponse.json(
//         { error: "Invalid token" },
//         { status: 401 }
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/:path*"],
// };
