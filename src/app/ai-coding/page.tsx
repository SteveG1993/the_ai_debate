const codingArticles = [
  {
    id: 1,
    title: "GitHub Copilot Chat: Conversational AI for Code",
    summary: "New chat interface allows developers to discuss code problems and get contextual suggestions in natural language.",
    source: "GitHub Blog",
    date: "2024-01-15",
    url: "#",
    category: "New Release"
  },
  {
    id: 2,
    title: "Claude Code: Anthropic's Developer-Focused AI",
    summary: "Command-line AI assistant specifically designed for software engineering tasks and code generation.",
    source: "Anthropic News",
    date: "2024-01-14",
    url: "#",
    category: "New Tool"
  },
  {
    id: 3,
    title: "Cursor IDE Integrates GPT-4 for Smart Autocomplete",
    summary: "Revolutionary code editor provides intelligent completions and refactoring suggestions using advanced language models.",
    source: "Dev Tools Weekly",
    date: "2024-01-13",
    url: "#",
    category: "IDE Update"
  },
  {
    id: 4,
    title: "AI-Powered Code Review: Finding Bugs Before Deployment",
    summary: "Automated systems now detect security vulnerabilities and code quality issues with 90% accuracy.",
    source: "InfoQ",
    date: "2024-01-12",
    url: "#",
    category: "Code Quality"
  }
];

const toolCategories = [
  {
    name: "Code Generation",
    tools: ["GitHub Copilot", "CodeT5", "Claude Code", "Amazon CodeWhisperer"],
    description: "AI assistants that help write code from natural language descriptions"
  },
  {
    name: "Code Review",
    tools: ["DeepCode", "CodeGuru", "SonarQube AI", "Snyk Code"],
    description: "Automated tools for detecting bugs, security issues, and code quality problems"
  },
  {
    name: "IDE Integration",
    tools: ["Cursor", "Replit Ghostwriter", "Tabnine", "Kite"],
    description: "Smart code completion and assistance directly in your development environment"
  }
];

export default function AICoding() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          AI Coding Tools & News
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated on the latest AI-powered development tools, from code generation 
          to automated testing. Discover how AI is transforming software development workflows.
        </p>
      </div>

      {/* Latest News Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
        <div className="grid gap-8">
          {codingArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{article.source}</div>
                  <div>{article.date}</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {article.title}
              </h3>
              
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {article.summary}
              </p>
              
              <div className="flex justify-between items-center">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Read More
                </button>
                <div className="text-sm text-gray-500">
                  💬 Developer Discussion
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tool Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">AI Tool Categories</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {toolCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-700 mb-4">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="bg-blue-50 px-3 py-2 rounded-md text-sm">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Resources */}
      <section className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Getting Started with AI Coding Tools
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Best Practices</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Start with simple code generation tasks</li>
              <li>• Always review and test AI-generated code</li>
              <li>• Use AI tools to learn new patterns and approaches</li>
              <li>• Combine AI assistance with human expertise</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Popular Use Cases</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Boilerplate code generation</li>
              <li>• Unit test creation</li>
              <li>• Code documentation and comments</li>
              <li>• Bug detection and fixes</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}