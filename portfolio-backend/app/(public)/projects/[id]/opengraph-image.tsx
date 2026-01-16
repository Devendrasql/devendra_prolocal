import { ImageResponse } from "@vercel/og";
import { prisma } from "@/lib/prisma";

/* =========================
   CONFIG
========================= */
export const runtime = "nodejs"; // ✅ REQUIRED for Prisma

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/* =========================
   IMAGE GENERATOR
========================= */
export default async function OpenGraphImage({
  params,
}: {
  params: { id: string };
}) {
  const projectId = Number(params.id);

  if (isNaN(projectId)) {
    return fallbackImage("Invalid Project");
  }

  /* ======================
     Fetch project (DB)
  ====================== */
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      title: true,
      summary: true,
      featured: true,
    },
  });

  if (!project) {
    return fallbackImage("Project Not Found");
  }

  /* ======================
     Render OG Image
  ====================== */
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "radial-gradient(1200px 600px at top left, #1e293b 0%, #020617 60%)",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* SUBTLE DECORATIVE ACCENT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
            pointerEvents: "none",
          }}
        />

        {/* FEATURED BADGE */}
        {project.featured && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(34,197,94,0.15)",
              color: "#4ade80",
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 28,
              border: "1px solid rgba(74,222,128,0.4)",
            }}
          >
            Featured Project
          </div>
        )}

        {/* TITLE */}
        <h1
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            maxWidth: 1000,
          }}
        >
          {project.title}
        </h1>

        {/* SUMMARY */}
        <p
          style={{
            fontSize: 30,
            lineHeight: 1.4,
            maxWidth: 900,
            color: "#cbd5f5",
          }}
        >
          {project.summary}
        </p>

        {/* FOOTER */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 20,
            color: "#94a3b8",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          yourdomain.com
        </div>
      </div>
    ),
    size
  );
}

/* =========================
   FALLBACK IMAGE
========================= */
function fallbackImage(text: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {text}
      </div>
    ),
    size
  );
}
