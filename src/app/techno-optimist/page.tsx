import { loadArticles, CATEGORIES } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';

export default async function TechnoOptimistPage() {
  const articles = await loadArticles('techno-optimist');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {CATEGORIES['techno-optimist'].title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {CATEGORIES['techno-optimist'].description}
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
          <div className="text-green-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No optimist articles yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We're currently fetching the latest positive perspectives on AI development. 
            Check back soon for inspiring content about AI's potential benefits!
          </p>
        </div>
      )}

      {/* Category Info */}
      <div className="mt-16 bg-green-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-green-800 mb-4">About Techno-Optimist Perspectives</h3>
        <div className="prose prose-green max-w-none">
          <p className="text-green-700">
            This section showcases articles that highlight the positive potential of artificial intelligence. 
            Here you'll find content about AI breakthroughs, beneficial applications, and optimistic 
            outlooks on how AI can solve global challenges and improve human lives.
          </p>
          <p className="text-green-700 mt-4">
            <strong>What you'll find here:</strong>
          </p>
          <ul className="text-green-700 mt-2">
            <li>AI breakthroughs in healthcare, education, and science</li>
            <li>Success stories of AI improving efficiency and outcomes</li>
            <li>Research on AI's potential to solve global challenges</li>
            <li>Innovations that demonstrate AI's beneficial applications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}