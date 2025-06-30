const skepticArticles = [
  {
    id: 1,
    title: "AI Bias in Hiring Systems Creates New Inequalities",
    summary: "Study reveals how automated hiring tools perpetuate discrimination against minority candidates and women.",
    source: "Harvard Business Review",
    date: "2024-01-15",
    url: "#"
  },
  {
    id: 2,
    title: "The Coming Wave of AI-Driven Job Displacement",
    summary: "Economic analysis suggests 40% of current jobs at risk within a decade, with limited retraining options.",
    source: "Economic Policy Institute",
    date: "2024-01-14",
    url: "#"
  },
  {
    id: 3,
    title: "Privacy Concerns Mount as AI Surveillance Expands",
    summary: "Facial recognition and behavioral tracking raise fundamental questions about personal freedom and privacy rights.",
    source: "Electronic Frontier Foundation",
    date: "2024-01-13",
    url: "#"
  },
  {
    id: 4,
    title: "AI Deepfakes Threaten Democratic Institutions",
    summary: "Sophisticated fake videos and audio recordings undermine trust in information and electoral processes.",
    source: "Center for AI Safety",
    date: "2024-01-12",
    url: "#"
  }
];

export default function TechnoSkeptic() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-red-700 mb-4">
          Techno-Skeptic Perspective
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Examining the risks and unintended consequences of AI deployment. Critical analysis 
          of how artificial intelligence may impact society, privacy, and human welfare.
        </p>
      </div>

      <div className="grid gap-8">
        {skepticArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md p-8 border-l-4 border-red-500">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Critical Analysis
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{article.source}</div>
                <div>{article.date}</div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {article.title}
            </h2>
            
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex justify-between items-center">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
                Read Full Article
              </button>
              <div className="text-sm text-gray-500">
                💬 Join Discussion
              </div>
            </div>
            
            {/* Mock discussion preview */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Discussion</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 italic">
                  "We need stronger regulations and oversight before these systems become too embedded in society."
                </p>
                <div className="text-xs text-gray-500 mt-2">— Reader comment from 3 hours ago</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-red-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            The Importance of Caution
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            While AI offers remarkable capabilities, we must carefully consider its societal implications. 
            From privacy erosion to job displacement, the rapid deployment of AI systems without adequate 
            safeguards could create more problems than it solves. Thoughtful regulation and ethical 
            frameworks are essential.
          </p>
        </div>
      </div>
    </div>
  );
}