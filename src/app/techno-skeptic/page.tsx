import { loadArticles, CATEGORIES } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';

export default async function TechnoSkepticPage() {
  const articles = await loadArticles('techno-skeptic');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {CATEGORIES['techno-skeptic'].title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {CATEGORIES['techno-skeptic'].description}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest Articles ({articles.length})
          </h2>
          <div className="text-sm text-gray-500">
            Updated daily at 8:00 AM EST
          </div>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No skeptic articles yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We&apos;re currently fetching the latest critical analyses of AI development. 
            Check back soon for thoughtful content about AI risks and challenges!
          </p>
        </div>
      )}

      {/* Category Info */}
      <div className="mt-16 bg-red-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-red-800 mb-4">About Techno-Skeptic Perspectives</h3>
        <div className="prose prose-red max-w-none">
          <p className="text-red-700">
            This section presents critical analyses and cautionary perspectives on artificial intelligence development. 
            Here you&apos;ll find content that examines potential risks, unintended consequences, and the need for 
            responsible AI governance and regulation.
          </p>
          <p className="text-red-700 mt-4">
            <strong>What you&apos;ll find here:</strong>
          </p>
          <ul className="text-red-700 mt-2">
            <li>Analysis of AI risks and potential negative consequences</li>
            <li>Privacy, bias, and ethical concerns in AI systems</li>
            <li>Job displacement and economic disruption discussions</li>
            <li>Calls for AI regulation and responsible development</li>
            <li>Critical examination of AI hype and limitations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}