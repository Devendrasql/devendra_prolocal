import Link from "next/link";

type CaseStudy = {
  title: string;
  slug: string;
  company: string;
  role: string;
  duration: string;
  overview: string;
  challenge: string;
  solution: string;
  impact: string;
  image_url: string;
  tags: string[];
  metrics: Record<string, string>;
};

async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/case-studies/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
          <Link href="/case-studies" className="text-emerald-600 hover:underline">
            Back to Case Studies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="relative bg-gradient-to-b from-emerald-50 to-white py-12 border-b">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Case Studies
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-emerald-600 text-white text-sm font-semibold rounded-full">
                {caseStudy.company}
              </span>
              <span className="text-gray-600">{caseStudy.duration}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {caseStudy.title}
            </h1>

            <p className="text-xl font-semibold text-emerald-600">{caseStudy.role}</p>
          </div>
        </div>
      </div>

      {caseStudy.image_url && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <img src={caseStudy.image_url} alt={caseStudy.title} className="w-full h-96 object-cover rounded-2xl shadow-lg" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{caseStudy.overview}</p>
        </section>

        <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{caseStudy.challenge}</p>
        </section>

        <section className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Solution</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{caseStudy.solution}</p>
        </section>

        <section className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact & Results</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">{caseStudy.impact}</p>

          {Object.keys(caseStudy.metrics || {}).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-amber-200">
              {Object.entries(caseStudy.metrics).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-white rounded-lg">
                  <div className="text-3xl font-bold text-amber-600">{value}</div>
                  <div className="text-sm text-gray-600 mt-1 capitalize">{key.replace(/_/g, " ")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {caseStudy.tags.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>

      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Interested in working together?</h2>
          <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            Get in Touch
          </Link>
        </div>
      </div>
    </main>
  );
}
