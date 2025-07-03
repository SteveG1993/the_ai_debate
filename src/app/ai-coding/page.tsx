import { loadArticles, CATEGORIES } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';

export default async function AICodingPage() {
  const articles = await loadArticles('ai-coding');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {CATEGORIES['ai-coding'].title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {CATEGORIES['ai-coding'].description}
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
          <div className="text-blue-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No coding articles yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We&apos;re currently fetching the latest developments in AI coding tools. 
            Check back soon for exciting content about AI-powered development!
          </p>
        </div>
      )}

      {/* Category Info */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">About AI Coding Tools</h3>
        <div className="prose prose-blue max-w-none">
          <p className="text-blue-700">
            This section focuses on the latest developments in AI-powered development tools and programming assistance. 
            Here you&apos;ll find content about coding assistants, automated development workflows, and how AI is 
            transforming the software development process.
          </p>
          <p className="text-blue-700 mt-4">
            <strong>What you&apos;ll find here:</strong>
          </p>
          <ul className="text-blue-700 mt-2">
            <li>Reviews and updates on AI coding assistants (GitHub Copilot, ChatGPT, etc.)</li>
            <li>New AI-powered development tools and frameworks</li>
            <li>Code generation and automated programming breakthroughs</li>
            <li>Developer productivity improvements through AI</li>
            <li>Best practices for AI-assisted development</li>
          </ul>
        </div>
      </div>
    </div>
  );
}