import Link from "next/link";

const mockArticles = [
  {
    id: 1,
    title: "AI Breakthrough in Medical Diagnosis",
    summary: "New AI system achieves 95% accuracy in early cancer detection, potentially saving thousands of lives.",
    category: "optimist",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Concerns Rise Over AI Job Displacement",
    summary: "Study shows 40% of current jobs may be affected by AI automation within the next decade.",
    category: "skeptic",
    date: "2024-01-14",
  },
  {
    id: 3,
    title: "GitHub Copilot X: The Future of Coding",
    summary: "Microsoft's latest AI coding assistant promises to revolutionize software development workflows.",
    category: "coding",
    date: "2024-01-13",
  },
];

export default function Home() {
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
        
        <div className="grid md:grid-cols-3 gap-8">
          {mockArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                article.category === 'optimist' ? 'bg-green-100 text-green-800' :
                article.category === 'skeptic' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {article.category === 'optimist' ? 'Techno-Optimist' :
                 article.category === 'skeptic' ? 'Techno-Skeptic' :
                 'AI Coding'}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {article.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {article.summary}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{article.date}</span>
                <Link 
                  href={`/${article.category === 'optimist' ? 'techno-optimist' : 
                           article.category === 'skeptic' ? 'techno-skeptic' : 'ai-coding'}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 rounded-lg p-8 my-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Why AI Balance?
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          In the rapidly evolving world of artificial intelligence, it's crucial to examine both 
          the incredible opportunities and the legitimate concerns. This platform presents curated 
          content from multiple perspectives to help you form a well-rounded understanding of AI's 
          impact on our future.
        </p>
      </section>
    </div>
  );
}