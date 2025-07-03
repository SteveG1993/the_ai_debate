import fs from 'fs';
import path from 'path';

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  credibility: number;
  classified: boolean;
  classification?: {
    category: string;
    confidence: number;
    provider: string;
  };
  fetchedDate: string;
  expiresDate: string;
  classifiedDate?: string;
}

export interface ArticlesByCategory {
  'techno-optimist': Article[];
  'techno-skeptic': Article[];
  'ai-coding': Article[];
}

export const CATEGORIES = {
  'techno-optimist': {
    title: 'Techno-Optimist',
    description: 'Positive perspectives on AI development and its potential benefits',
    color: 'green'
  },
  'techno-skeptic': {
    title: 'Techno-Skeptic', 
    description: 'Critical analysis of AI risks and challenges',
    color: 'red'
  },
  'ai-coding': {
    title: 'AI Coding Tools',
    description: 'Latest developments in AI-powered development tools and programming',
    color: 'blue'
  }
} as const;

export async function loadArticles(category: keyof ArticlesByCategory): Promise<Article[]> {
  try {
    const contentDir = path.join(process.cwd(), 'content', category);
    
    if (!fs.existsSync(contentDir)) {
      return [];
    }

    const files = fs.readdirSync(contentDir);
    const articles: Article[] = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const article = JSON.parse(content) as Article;

      // Check if article is expired
      const now = new Date();
      const expiresDate = new Date(article.expiresDate);
      
      if (now < expiresDate) {
        articles.push(article);
      }
    }

    // Sort by publication date (newest first)
    return articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  } catch (error) {
    console.error(`Error loading articles for ${category}:`, error);
    return [];
  }
}

export async function loadAllArticles(): Promise<ArticlesByCategory> {
  const categories = Object.keys(CATEGORIES) as (keyof ArticlesByCategory)[];
  const result = {} as ArticlesByCategory;

  for (const category of categories) {
    result[category] = await loadArticles(category);
  }

  return result;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const allArticles = await loadAllArticles();
  
  for (const articles of Object.values(allArticles)) {
    const article = articles.find((a: Article) => a.id === id);
    if (article) return article;
  }
  
  return null;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}