const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const crypto = require('crypto');

class ArticleFetcher {
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
  }

  async loadSources() {
    try {
      const sourcesPath = path.join(__dirname, '../data/sources.json');
      const sourcesData = await fs.readFile(sourcesPath, 'utf8');
      return JSON.parse(sourcesData);
    } catch (error) {
      console.error('Error loading sources:', error);
      return { sources: {} };
    }
  }

  async loadSourcePullLog() {
    try {
      const logPath = path.join(__dirname, '../data/source-pull-log.json');
      const logData = await fs.readFile(logPath, 'utf8');
      return JSON.parse(logData);
    } catch (error) {
      console.log('Creating new source pull log...');
      return {
        sources: {},
        lastUpdated: null,
        totalPulls: 0
      };
    }
  }

  async saveSourcePullLog(log) {
    try {
      const logPath = path.join(__dirname, '../data/source-pull-log.json');
      await fs.writeFile(logPath, JSON.stringify(log, null, 2));
    } catch (error) {
      console.error('Error saving source pull log:', error);
    }
  }

  async updateSourcePullCount(sourceName, sourceUrl) {
    const log = await this.loadSourcePullLog();
    
    const sourceKey = `${sourceName}|${sourceUrl}`;
    
    if (!log.sources[sourceKey]) {
      log.sources[sourceKey] = {
        name: sourceName,
        url: sourceUrl,
        pullCount: 0,
        firstSeen: new Date().toISOString(),
        lastPull: null
      };
      console.log(`📝 New source detected: ${sourceName}`);
    }
    
    log.sources[sourceKey].pullCount++;
    log.sources[sourceKey].lastPull = new Date().toISOString();
    log.lastUpdated = new Date().toISOString();
    log.totalPulls++;
    
    await this.saveSourcePullLog(log);
    
    return log.sources[sourceKey].pullCount;
  }

  async fetchRSSFeed(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Fetching RSS feed: ${url} (attempt ${i + 1})`);
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'AI-Perspectives-Bot/1.0'
          }
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${url} (attempt ${i + 1}):`, error.message);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
      }
    }
  }

  parseRSSContent(xmlContent) {
    try {
      const parsed = this.parser.parse(xmlContent);
      const channel = parsed.rss?.channel || parsed.feed;
      
      if (!channel) {
        console.error('No valid RSS/Atom feed found');
        return [];
      }

      let items = channel.item || channel.entry || [];
      if (!Array.isArray(items)) {
        items = [items];
      }

      return items.map(item => ({
        title: this.extractText(item.title),
        description: this.extractText(item.description || item.summary || item.content),
        link: item.link?.href || item.link,
        pubDate: item.pubDate || item.published || item.updated,
        guid: this.generateValidId(this.extractText(item.guid) || this.extractText(item.id) || item.title, item.link)
      })).filter(article => article.title && article.link);
    } catch (error) {
      console.error('Error parsing RSS content:', error);
      return [];
    }
  }

  extractText(content) {
    if (!content) return '';
    if (typeof content === 'string') return content.replace(/<[^>]*>/g, '').trim();
    if (content['#text']) return content['#text'].trim();
    if (content._) return content._.trim();
    return String(content).replace(/<[^>]*>/g, '').trim();
  }

  generateId(title, link) {
    const content = `${title || ''}${link || ''}`;
    return crypto.createHash('md5').update(content).digest('hex');
  }

  generateValidId(originalId, link) {
    // If originalId looks like a URL or contains invalid filename characters, generate a hash
    if (!originalId || originalId.includes('://') || originalId.includes('/') || originalId.includes('?') || originalId.includes('#')) {
      return this.generateId(originalId || '', link || '');
    }
    // Clean the ID to ensure it's filesystem-safe
    return originalId.replace(/[^a-zA-Z0-9\-_]/g, '-');
  }

  async loadExistingArticles(category) {
    try {
      const contentDir = path.join(__dirname, `../content/${category}`);
      const files = await fs.readdir(contentDir);
      const existingIds = new Set();
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const article = JSON.parse(content);
          existingIds.add(article.id);
        }
      }
      
      return existingIds;
    } catch (error) {
      console.log(`No existing articles found for ${category}`);
      return new Set();
    }
  }

  async saveArticle(article, category) {
    try {
      const contentDir = path.join(__dirname, `../content/${category}`);
      await fs.mkdir(contentDir, { recursive: true });
      
      const filename = `${article.id}.json`;
      const filepath = path.join(contentDir, filename);
      
      const articleData = {
        ...article,
        fetchedDate: new Date().toISOString(),
        expiresDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day from now
      };
      
      await fs.writeFile(filepath, JSON.stringify(articleData, null, 2));
      console.log(`Saved article: ${article.title}`);
    } catch (error) {
      console.error(`Error saving article ${article.id}:`, error);
    }
  }

  async fetchArticlesForCategory(sources, category) {
    console.log(`\n=== Fetching articles for ${category} ===`);
    const existingArticles = await this.loadExistingArticles(category);
    let newArticleCount = 0;

    for (const source of sources) {
      if (!source.active) continue;
      
      try {
        console.log(`\nProcessing source: ${source.name}`);
        const xmlContent = await this.fetchRSSFeed(source.rss);
        const articles = this.parseRSSContent(xmlContent);
        
        // Find the first article that doesn't exist yet (pull one article per source)
        let articlePulled = false;
        for (const article of articles) {
          if (!existingArticles.has(article.guid)) {
            const enhancedArticle = {
              id: article.guid,
              title: article.title,
              description: article.description,
              link: article.link,
              pubDate: article.pubDate,
              source: source.name,
              category: category,
              credibility: source.credibility,
              classified: false // Will be updated by classification script
            };
            
            await this.saveArticle(enhancedArticle, category);
            
            // Update pull count for this source
            const pullCount = await this.updateSourcePullCount(source.name, source.rss);
            console.log(`✅ Pulled article from ${source.name} (Pull #${pullCount}): ${article.title}`);
            
            newArticleCount++;
            articlePulled = true;
            break; // Only pull one article per source
          }
        }
        
        if (!articlePulled && articles.length > 0) {
          console.log(`⏭️  ${source.name}: All articles already exist, skipping`);
        } else if (articles.length === 0) {
          console.log(`⚠️  ${source.name}: No articles found in feed`);
        }
        
      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error.message);
      }
    }

    console.log(`✅ ${category}: Added ${newArticleCount} new articles`);
    return newArticleCount;
  }

  async run() {
    console.log('🚀 Starting article fetching process...');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    
    const sourcesData = await this.loadSources();
    let totalNewArticles = 0;

    // Fetch articles for each category
    for (const [category, sources] of Object.entries(sourcesData.sources)) {
      const categoryMapping = {
        'techno-optimist': 'techno-optimist',
        'techno-skeptic': 'techno-skeptic',
        'ai-coding': 'ai-coding'
      };
      
      const mappedCategory = categoryMapping[category] || category;
      const count = await this.fetchArticlesForCategory(sources, mappedCategory);
      totalNewArticles += count;
    }

    console.log(`\n🎉 Fetching complete! Added ${totalNewArticles} new articles total.`);
    
    // Display source pull statistics
    const pullLog = await this.loadSourcePullLog();
    console.log(`\n📊 Source Pull Statistics:`);
    console.log(`Total pulls across all sources: ${pullLog.totalPulls}`);
    console.log(`Total sources tracked: ${Object.keys(pullLog.sources).length}`);
    
    // Show top sources by pull count
    const sortedSources = Object.values(pullLog.sources)
      .sort((a, b) => b.pullCount - a.pullCount)
      .slice(0, 5);
    
    if (sortedSources.length > 0) {
      console.log(`\nTop 5 sources by pull count:`);
      sortedSources.forEach((source, index) => {
        console.log(`${index + 1}. ${source.name}: ${source.pullCount} pulls`);
      });
    }
    
    // Update metadata
    const metadata = {
      lastFetch: new Date().toISOString(),
      totalNewArticles,
      nextFetch: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    await fs.writeFile(
      path.join(__dirname, '../data/fetch-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }
}

// Run if called directly
if (require.main === module) {
  const fetcher = new ArticleFetcher();
  fetcher.run().catch(console.error);
}

module.exports = ArticleFetcher;