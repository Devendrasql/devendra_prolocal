import Link from "next/link";

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  company: string;
  role: string;
  duration: string;
  overview: string;
  image_url: string;
  tags: string[];
  featured: boolean;
};

async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/case-studies?published=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-emerald-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deep dives into product challenges, solutions, and measurable outcomes
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        {caseStudies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No case studies available yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {caseStudies.map((cs, index) => (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.slug}`}
                className="group block"
              >
                <div className={`bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex flex-col md:flex`}>
                  <div className="md:w-1/2 relative bg-gradient-to-br from-emerald-100 to-amber-100 min-h-[300px] flex items-center justify-center overflow-hidden">
                    {cs.image_url ? (
                      <img src={cs.image_url} alt={cs.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-8xl font-bold text-white opacity-20">{cs.company.charAt(0)}</div>
                    )}
                    {cs.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 font-bold text-sm rounded-full flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                            {cs.company}
                          </span>
                          <span className="text-sm text-gray-500">{cs.duration}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {cs.title}
                        </h2>
                        <p className="text-sm font-semibold text-gray-600 mb-4">{cs.role}</p>
                      </div>

                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {cs.overview}
                      </p>

                      {cs.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {cs.tags.slice(0, 4).map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
                          Read Case Study
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
