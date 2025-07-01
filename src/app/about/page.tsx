export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About AI Perspectives
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fostering informed discourse about artificial intelligence through balanced perspectives
        </p>
      </div>

      <div className="prose prose-lg mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            AI Perspectives exists to provide a platform for thoughtful discussion about artificial intelligence's 
            impact on society. We believe that understanding AI requires examining both its tremendous potential 
            and its legitimate risks. By presenting multiple perspectives, we help readers develop nuanced 
            viewpoints about this transformative technology.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-700 mb-3">Optimism with Responsibility</h3>
              <p className="text-gray-700">
                We celebrate AI's potential to solve global challenges while acknowledging the need 
                for responsible development and deployment.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-700 mb-3">Critical Thinking</h3>
              <p className="text-gray-700">
                We encourage skeptical inquiry and examination of AI's unintended consequences 
                and potential risks to society.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-700 mb-3">Practical Application</h3>
              <p className="text-gray-700">
                We focus on real-world applications and tools that developers and organizations 
                can use today.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-700 mb-3">Informed Discourse</h3>
              <p className="text-gray-700">
                We prioritize evidence-based discussion and expert analysis over sensationalism 
                or unfounded claims.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why AI Matters</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The AI discourse is often polarized between utopian visions and dystopian fears. 
            This polarization doesn't serve anyone well. Reality lies somewhere in between, 
            and understanding that nuance is crucial for making good decisions about AI policy, 
            adoption, and development.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By presenting both optimistic and skeptical perspectives side by side, we help 
            readers develop a more complete understanding of AI's implications. This balanced 
            approach enables better decision-making for individuals, organizations, and society.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">Automated Content Curation</h3>
            <p className="text-gray-700 mb-4">
              Our platform automatically aggregates content from trusted sources across the AI spectrum:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li><strong>Techno-Optimist:</strong> MIT Technology Review, VentureBeat AI, research institutions</li>
              <li><strong>Techno-Skeptic:</strong> AI Now Institute, Center for AI Safety, policy organizations</li>
              <li><strong>AI Coding Tools:</strong> GitHub, Stack Overflow, developer communities</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Content is refreshed daily and automatically expires after one week to keep discussions current and relevant.
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Join the Conversation</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            AI Perspectives is a community-driven platform. We encourage thoughtful discussion, 
            respectful debate, and evidence-based arguments. Whether you're an AI researcher, 
            developer, policymaker, or simply curious about AI's future, your perspective matters.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Start Reading
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
              Join Discussion
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}