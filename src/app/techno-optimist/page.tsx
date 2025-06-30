const optimistArticles = [
  {
    id: 1,
    title: "AI Revolutionizes Climate Change Solutions",
    summary: "Machine learning algorithms help identify new materials for carbon capture, accelerating clean energy innovation.",
    source: "MIT Technology Review",
    date: "2024-01-15",
    url: "#"
  },
  {
    id: 2,
    title: "Medical AI Saves Lives Through Early Detection",
    summary: "AI system achieves 95% accuracy in cancer screening, potentially preventing thousands of deaths annually.",
    source: "Nature Medicine",
    date: "2024-01-14",
    url: "#"
  },
  {
    id: 3,
    title: "AI Tutors Personalize Learning for Millions",
    summary: "Adaptive AI systems provide customized education, improving learning outcomes for students worldwide.",
    source: "EdTech Weekly",
    date: "2024-01-13",
    url: "#"
  },
  {
    id: 4,
    title: "Autonomous Vehicles Reduce Traffic Deaths by 40%",
    summary: "Latest data shows self-driving cars significantly improve road safety in pilot programs across major cities.",
    source: "Transportation Today",
    date: "2024-01-12",
    url: "#"
  }
];

export default function TechnoOptimist() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Techno-Optimist Perspective
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the positive potential of AI technology. From breakthrough medical advances 
          to solutions for global challenges, explore how AI is creating a better future.
        </p>
      </div>

      <div className="grid gap-8">
        {optimistArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Positive Impact
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
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
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
                  "This is exactly the kind of breakthrough we need. AI applied responsibly can solve our biggest challenges."
                </p>
                <div className="text-xs text-gray-500 mt-2">— Reader comment from 2 hours ago</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            The Promise of AI
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Artificial intelligence represents humanity's greatest opportunity to solve complex problems 
            at scale. From accelerating scientific discovery to democratizing access to education and healthcare, 
            AI can amplify human potential and create unprecedented prosperity.
          </p>
        </div>
      </div>
    </div>
  );
}