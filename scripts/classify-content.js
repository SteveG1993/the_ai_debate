const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

class ContentClassifier {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.claudeApiKey = process.env.CLAUDE_API_KEY;
  }

  async classifyWithOpenAI(title, description) {
    if (!this.openaiApiKey) {
      console.log('No OpenAI API key found, skipping OpenAI classification');
      return null;
    }

    try {
      const prompt = `Analyze this AI-related article and classify it as one of:
1. "techno-optimist" - focuses on positive aspects, benefits, or promising developments in AI
2. "techno-skeptic" - focuses on risks, concerns, criticism, or cautionary aspects of AI  
3. "ai-coding" - focuses on AI development tools, programming, technical implementation

Title: ${title}
Description: ${description}

Respond with only the classification category and confidence score (0-1):
Format: category|confidence`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an AI content classifier specializing in AI/tech articles.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.choices[0].message.content.trim();
      const [category, confidence] = result.split('|');
      
      return {
        category,
        confidence: parseFloat(confidence) || 0.5,
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI classification error:', error.message);
      return null;
    }
  }

  async classifyWithClaude(title, description) {
    if (!this.claudeApiKey) {
      console.log('No Claude API key found, skipping Claude classification');
      return null;
    }

    try {
      const prompt = `Analyze this AI article and classify it:

Title: ${title}
Description: ${description}

Categories:
- techno-optimist: positive AI developments, benefits, breakthroughs
- techno-skeptic: AI risks, concerns, criticisms, warnings
- ai-coding: AI development tools, programming, technical aspects

Respond with: category|confidence_score`;

      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        messages: [
          { role: 'user', content: prompt }
        ]
      }, {
        headers: {
          'x-api-key': this.claudeApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      const result = response.data.content[0].text.trim();
      const [category, confidence] = result.split('|');
      
      return {
        category,
        confidence: parseFloat(confidence) || 0.5,
        provider: 'claude'
      };
    } catch (error) {
      console.error('Claude classification error:', error.message);
      return null;
    }
  }

  async fallbackClassification(title, description) {
    // Simple keyword-based fallback classification
    const text = `${title} ${description}`.toLowerCase();
    
    const optimistKeywords = ['breakthrough', 'innovation', 'advancement', 'improve', 'benefit', 'success', 'efficient', 'revolutionary', 'promising'];
    const skepticKeywords = ['risk', 'danger', 'concern', 'warning', 'threat', 'bias', 'privacy', 'job loss', 'ethical', 'regulation'];
    const codingKeywords = ['api', 'code', 'programming', 'developer', 'github', 'tool', 'framework', 'library', 'software'];

    let optimistScore = 0;
    let skepticScore = 0;
    let codingScore = 0;

    optimistKeywords.forEach(keyword => {
      if (text.includes(keyword)) optimistScore++;
    });
    
    skepticKeywords.forEach(keyword => {
      if (text.includes(keyword)) skepticScore++;
    });
    
    codingKeywords.forEach(keyword => {
      if (text.includes(keyword)) codingScore++;
    });

    const maxScore = Math.max(optimistScore, skepticScore, codingScore);
    let category = 'techno-optimist'; // default
    
    if (maxScore === skepticScore && skepticScore > 0) {
      category = 'techno-skeptic';
    } else if (maxScore === codingScore && codingScore > 0) {
      category = 'ai-coding';
    }

    return {
      category,
      confidence: Math.min(maxScore * 0.2, 0.8), // Scale confidence based on keyword matches
      provider: 'fallback'
    };
  }

  async classifyArticle(article) {
    console.log(`Classifying: ${article.title}`);
    
    // Try OpenAI first, then Claude, then fallback
    let classification = await this.classifyWithOpenAI(article.title, article.description);
    
    if (!classification) {
      classification = await this.classifyWithClaude(article.title, article.description);
    }
    
    if (!classification) {
      classification = await this.fallbackClassification(article.title, article.description);
    }

    return classification;
  }

  async moveArticleToCorrectCategory(article, newCategory, originalCategory) {
    if (newCategory === originalCategory) return;

    try {
      // Create new category directory if it doesn't exist
      const newDir = path.join(__dirname, `../content/${newCategory}`);
      await fs.mkdir(newDir, { recursive: true });

      // Copy article to new category
      const newPath = path.join(newDir, `${article.id}.json`);
      await fs.writeFile(newPath, JSON.stringify(article, null, 2));

      // Remove from original category
      const oldPath = path.join(__dirname, `../content/${originalCategory}/${article.id}.json`);
      await fs.unlink(oldPath);

      console.log(`✅ Moved article to ${newCategory}: ${article.title}`);
    } catch (error) {
      console.error(`Error moving article ${article.id}:`, error);
    }
  }

  async processCategory(category) {
    try {
      const contentDir = path.join(__dirname, `../content/${category}`);
      const files = await fs.readdir(contentDir);
      let classifiedCount = 0;
      let movedCount = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(contentDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const article = JSON.parse(content);

        // Skip if already classified
        if (article.classified) continue;

        const classification = await this.classifyArticle(article);
        
        // Update article with classification
        article.classification = classification;
        article.classified = true;
        article.classifiedDate = new Date().toISOString();

        // Move to correct category if needed
        if (classification.category !== category) {
          await this.moveArticleToCorrectCategory(article, classification.category, category);
          movedCount++;
        } else {
          // Update in current location
          await fs.writeFile(filePath, JSON.stringify(article, null, 2));
        }

        classifiedCount++;
        
        // Rate limiting - wait between classifications
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`✅ ${category}: Classified ${classifiedCount} articles, moved ${movedCount}`);
      return { classified: classifiedCount, moved: movedCount };
    } catch (error) {
      console.error(`Error processing category ${category}:`, error);
      return { classified: 0, moved: 0 };
    }
  }

  async run() {
    console.log('🤖 Starting content classification...');
    
    const categories = ['techno-optimist', 'techno-skeptic', 'ai-coding'];
    let totalClassified = 0;
    let totalMoved = 0;

    for (const category of categories) {
      console.log(`\n=== Processing ${category} ===`);
      const result = await this.processCategory(category);
      totalClassified += result.classified;
      totalMoved += result.moved;
    }

    console.log(`\n🎉 Classification complete!`);
    console.log(`Total articles classified: ${totalClassified}`);
    console.log(`Total articles moved: ${totalMoved}`);

    // Save classification metadata
    const metadata = {
      lastClassification: new Date().toISOString(),
      totalClassified,
      totalMoved,
      apiProviders: {
        openai: !!this.openaiApiKey,
        claude: !!this.claudeApiKey
      }
    };

    await fs.writeFile(
      path.join(__dirname, '../data/classification-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }
}

// Run if called directly
if (require.main === module) {
  const classifier = new ContentClassifier();
  classifier.run().catch(console.error);
}

module.exports = ContentClassifier;