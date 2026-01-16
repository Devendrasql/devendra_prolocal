import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export async function adminGuard(req: Request) {
  try {
    // 1️⃣ Read Authorization header (preferred)
    const auth = req.headers.get("authorization");
    let token: string | null = null;

    if (auth?.startsWith("Bearer ")) {
      token = auth.slice(7);
    }

    // 2️⃣ Fallback to cookie (App Router requires await)
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("accessToken")?.value ?? null;
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);

    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ✅ ALLOW REQUEST
    return null;
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}







// // lib/adminGuard.ts
// import { NextResponse } from "next/server";
// import { verifyAccessToken } from "@/lib/auth";

// export async function adminGuard(
//   req: Request
// ): Promise<NextResponse | null> {
//   const auth = req.headers.get("authorization");

//   if (!auth?.startsWith("Bearer ")) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const token = auth.replace("Bearer ", "");

//   try {
//     const payload = verifyAccessToken(token);

//     if (payload.role !== "ADMIN") {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     return null;
//   } catch {
//     return NextResponse.json(
//       { error: "Invalid token" },
//       { status: 401 }
//     );
//   }
// }








// // // lib/adminGuard.ts
// // import { NextResponse } from "next/server";
// // import { verifyAccessToken } from "./auth";

// // export async function adminGuard(req: Request) {
// //   const authHeader = req.headers.get("authorization");

// //   if (!authHeader?.startsWith("Bearer ")) {
// //     return NextResponse.json(
// //       { error: "Unauthorized" },
// //       { status: 401 }
// //     );
// //   }

// //   const token = authHeader.slice(7);

// //   try {
// //     const payload = verifyAccessToken(token);

// //     if (payload.role !== "ADMIN") {
// //       return NextResponse.json(
// //         { error: "Forbidden" },
// //         { status: 403 }
// //       );
// //     }

// //     return payload; // ✅ success
// //   } catch (err) {
// //     return NextResponse.json(
// //       { error: "Invalid or expired token" },
// //       { status: 401 }
// //     );
// //   }
// // }
