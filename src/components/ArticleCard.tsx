import Link from 'next/link';
import { Article, formatDate, getTimeAgo, truncateText } from '@/lib/content';

interface ArticleCardProps {
  article: Article;
  showCategory?: boolean;
}

export default function ArticleCard({ article, showCategory = false }: ArticleCardProps) {
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
        return 'Optimist';
      case 'techno-skeptic':
        return 'Skeptic';
      case 'ai-coding':
        return 'Coding';
      default:
        return category;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-3">
        {showCategory && (
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category)}
          </span>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{getTimeAgo(article.pubDate)}</span>
          {article.classification && (
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
              {Math.round(article.classification.confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
        <Link 
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          {article.title}
        </Link>
      </h3>

      <p className="text-gray-600 mb-4 leading-relaxed">
        {truncateText(article.description, 200)}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{article.source}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{formatDate(article.pubDate)}</span>
          <Link
            href={`/article/${article.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Discuss →
          </Link>
        </div>
      </div>
    </div>
  );
}