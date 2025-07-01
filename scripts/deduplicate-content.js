const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ContentDeduplicator {
  constructor() {
    this.categories = ['techno-optimist', 'techno-skeptic', 'ai-coding'];
    this.duplicates = [];
  }

  // Generate content hash for similarity comparison
  generateContentHash(title, description) {
    const content = `${title} ${description}`.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Calculate similarity between two strings using Levenshtein distance
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async loadAllArticles() {
    const allArticles = [];
    
    for (const category of this.categories) {
      try {
        const contentDir = path.join(__dirname, `../content/${category}`);
        const files = await fs.readdir(contentDir);
        
        for (const file of files) {
          if (!file.endsWith('.json')) continue;
          
          const filePath = path.join(contentDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const article = JSON.parse(content);
          
          allArticles.push({
            ...article,
            filePath,
            category
          });
        }
      } catch (error) {
        console.log(`Category ${category} not found or empty`);
      }
    }
    
    return allArticles;
  }

  async findDuplicates(articles) {
    const duplicateGroups = [];
    const processed = new Set();
    
    console.log(`Checking ${articles.length} articles for duplicates...`);
    
    for (let i = 0; i < articles.length; i++) {
      if (processed.has(i)) continue;
      
      const article1 = articles[i];
      const duplicateGroup = [i];
      
      for (let j = i + 1; j < articles.length; j++) {
        if (processed.has(j)) continue;
        
        const article2 = articles[j];
        
        // Check for exact URL match
        if (article1.link === article2.link) {
          duplicateGroup.push(j);
          processed.add(j);
          continue;
        }
        
        // Check for title similarity (high threshold)
        const titleSimilarity = this.calculateSimilarity(
          article1.title.toLowerCase(),
          article2.title.toLowerCase()
        );
        
        if (titleSimilarity > 0.85) {
          duplicateGroup.push(j);
          processed.add(j);
          continue;
        }
        
        // Check for content hash similarity
        const hash1 = this.generateContentHash(article1.title, article1.description || '');
        const hash2 = this.generateContentHash(article2.title, article2.description || '');
        
        if (hash1 === hash2) {
          duplicateGroup.push(j);
          processed.add(j);
        }
      }
      
      if (duplicateGroup.length > 1) {
        duplicateGroups.push(duplicateGroup.map(index => articles[index]));
      }
      
      processed.add(i);
    }
    
    return duplicateGroups;
  }

  selectBestArticle(duplicateGroup) {
    // Prioritize by:
    // 1. Higher credibility score
    // 2. More recent publication date
    // 3. Longer description
    // 4. Source preference
    
    return duplicateGroup.reduce((best, current) => {
      // Prefer higher credibility
      if (current.credibility > best.credibility) return current;
      if (current.credibility < best.credibility) return best;
      
      // Prefer more recent articles
      const currentDate = new Date(current.pubDate || 0);
      const bestDate = new Date(best.pubDate || 0);
      if (currentDate > bestDate) return current;
      if (currentDate < bestDate) return best;
      
      // Prefer longer descriptions
      const currentDescLength = (current.description || '').length;
      const bestDescLength = (best.description || '').length;
      if (currentDescLength > bestDescLength) return current;
      
      return best;
    });
  }

  async removeDuplicateFiles(articlesToRemove) {
    let removedCount = 0;
    
    for (const article of articlesToRemove) {
      try {
        await fs.unlink(article.filePath);
        console.log(`🗑️  Removed duplicate: ${article.title}`);
        removedCount++;
      } catch (error) {
        console.error(`Error removing duplicate ${article.filePath}:`, error);
      }
    }
    
    return removedCount;
  }

  async run() {
    console.log('🔍 Starting duplicate content detection...');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    
    const articles = await this.loadAllArticles();
    console.log(`Loaded ${articles.length} articles total`);
    
    if (articles.length === 0) {
      console.log('No articles found to process');
      return { duplicateGroups: 0, articlesRemoved: 0 };
    }
    
    const duplicateGroups = await this.findDuplicates(articles);
    console.log(`\nFound ${duplicateGroups.length} duplicate groups`);
    
    let totalRemoved = 0;
    const duplicateReport = [];
    
    for (const [index, group] of duplicateGroups.entries()) {
      console.log(`\n--- Duplicate Group ${index + 1} ---`);
      
      const bestArticle = this.selectBestArticle(group);
      const articlesToRemove = group.filter(article => article.id !== bestArticle.id);
      
      console.log(`✅ Keeping: ${bestArticle.title} (${bestArticle.source})`);
      
      for (const article of articlesToRemove) {
        console.log(`❌ Removing: ${article.title} (${article.source})`);
      }
      
      const removedCount = await this.removeDuplicateFiles(articlesToRemove);
      totalRemoved += removedCount;
      
      duplicateReport.push({
        kept: {
          title: bestArticle.title,
          source: bestArticle.source,
          id: bestArticle.id
        },
        removed: articlesToRemove.map(a => ({
          title: a.title,
          source: a.source,
          id: a.id
        }))
      });
    }
    
    console.log(`\n🎉 Deduplication complete!`);
    console.log(`Duplicate groups found: ${duplicateGroups.length}`);
    console.log(`Articles removed: ${totalRemoved}`);
    console.log(`Articles remaining: ${articles.length - totalRemoved}`);
    
    // Save deduplication report
    const report = {
      timestamp: new Date().toISOString(),
      totalArticlesProcessed: articles.length,
      duplicateGroupsFound: duplicateGroups.length,
      articlesRemoved: totalRemoved,
      articlesRemaining: articles.length - totalRemoved,
      duplicateGroups: duplicateReport
    };
    
    await fs.writeFile(
      path.join(__dirname, '../data/deduplication-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    return report;
  }
}

// Run if called directly
if (require.main === module) {
  const deduplicator = new ContentDeduplicator();
  deduplicator.run().catch(console.error);
}

module.exports = ContentDeduplicator;