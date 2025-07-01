import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, formatDate, getTimeAgo } from '@/lib/content';
import DiscussionSection from '@/components/DiscussionSection';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'techno-optimist':
        return 'bg-green-100 text-green-800';
      case 'techno-skeptic':
        return 'bg-red-100 text-red-800';
      case 'ai-coding':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'techno-optimist':
        return 'Techno-Optimist';
      case 'techno-skeptic':
        return 'Techno-Skeptic';
      case 'ai-coding':
        return 'AI Coding Tools';
      default:
        return category;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>’</span>
          <Link href={`/${article.category}`} className="hover:text-blue-600">
            {getCategoryLabel(article.category)}
          </Link>
          <span>’</span>
          <span className="text-gray-900">Article Discussion</span>
        </div>
      </nav>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category)}
          </span>
          <div className="text-sm text-gray-500">
            {getTimeAgo(article.pubDate)}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">{article.source}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${i < Math.round(article.credibility * 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-500">
                ({article.credibility.toFixed(1)})
              </span>
            </div>
          </div>
          <span className="text-sm text-gray-500">{formatDate(article.pubDate)}</span>
        </div>

        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            {article.description}
          </p>
        </div>

        {article.classification && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">AI Classification</h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                Classified as: <span className="font-medium">{getCategoryLabel(article.classification.category)}</span>
              </span>
              <span className="text-gray-600">
                Confidence: <span className="font-medium">{Math.round(article.classification.confidence * 100)}%</span>
              </span>
              <span className="text-gray-600">
                Provider: <span className="font-medium capitalize">{article.classification.provider}</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Read Full Article
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          
          <div className="text-sm text-gray-500">
            Expires: {formatDate(article.expiresDate)}
          </div>
        </div>
      </article>

      {/* Discussion Section */}
      <DiscussionSection articleId={article.id} title={article.title} />
    </div>
  );
}