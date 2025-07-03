import Link from "next/link";
import { loadAllArticles, CATEGORIES, Article } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';

export default async function Home() {
  const allArticles = await loadAllArticles();
  
  // Get featured articles (2 most recent from each category)
  const featuredArticles: Article[] = [];
  Object.entries(allArticles).forEach(([category, articles]) => {
    featuredArticles.push(...articles.slice(0, 2));
  });
  
  // Sort featured articles by publication date
  featuredArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI Perspectives
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Exploring AI's impact through balanced perspectives. Discover the promise and perils 
          of artificial intelligence, from breakthrough innovations to ethical challenges.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/techno-optimist"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Optimistic Views
          </Link>
          <Link 
            href="/techno-skeptic"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Cautious Views
          </Link>
          <Link 
            href="/ai-coding"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Coding Tools
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Latest Articles
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.length > 0 ? (
            featuredArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} showCategory={true} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No articles yet</h3>
              <p className="text-gray-500">
                Articles will appear here automatically at 8:00 AM EST daily. 
                Check back soon for the latest AI perspectives!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-blue-50 rounded-lg p-8 my-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Why AI Perspectives?
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          In the rapidly evolving world of artificial intelligence, it&apos;s crucial to examine both 
          the incredible opportunities and the legitimate concerns. This platform presents curated 
          content from multiple perspectives to help you form a well-rounded understanding of AI&apos;s 
          impact on our future.
        </p>
      </section>
    </div>
  );
}