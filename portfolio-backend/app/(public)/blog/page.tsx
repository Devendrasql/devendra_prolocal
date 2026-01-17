import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author: string;
  tags: string[];
  views: number;
  read_time: number;
  created_at: string;
};

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/blog?published=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-amber-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Product Management Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thoughts on product strategy, leadership, and building great products
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all"
              >
                <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl font-bold text-amber-200">
                      {post.title.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{post.read_time} min read</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
