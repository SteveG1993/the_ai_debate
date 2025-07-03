'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

interface DiscussionSectionProps {
  articleId?: string;
  title?: string;
}

export default function DiscussionSection({}: DiscussionSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !authorName.trim()) return;
    
    setIsSubmitting(true);
    
    // In a real implementation, this would save to a database
    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName.trim(),
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Discussion
      </h2>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="author"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Share your thoughts on this article..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim() || !authorName.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456l-3.448 1.724a1 1 0 01-1.39-1.39l1.724-3.448A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <p className="text-gray-500">
              Be the first to start the discussion about this article!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Discussion Guidelines */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Discussion Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Keep discussions respectful and on-topic</li>
          <li>• Provide evidence for claims when possible</li>
          <li>• Consider multiple perspectives</li>
          <li>• Avoid personal attacks or harassment</li>
        </ul>
      </div>
    </div>
  );
}