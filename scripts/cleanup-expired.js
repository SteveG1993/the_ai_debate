const fs = require('fs').promises;
const path = require('path');

class ContentCleanup {
  constructor() {
    this.categories = ['techno-optimist', 'techno-skeptic', 'ai-coding'];
  }

  async cleanupCategory(category) {
    try {
      const contentDir = path.join(__dirname, `../content/${category}`);
      const files = await fs.readdir(contentDir);
      let removedCount = 0;
      const now = new Date();

      console.log(`\n=== Cleaning up ${category} ===`);

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(contentDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const article = JSON.parse(content);

        // Check if article is expired
        const expiresDate = new Date(article.expiresDate);
        const isExpired = now > expiresDate;

        if (isExpired) {
          await fs.unlink(filePath);
          console.log(`🗑️  Removed expired article: ${article.title}`);
          removedCount++;
        } else {
          const daysRemaining = Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24));
          console.log(`⏳ Keeping article (${daysRemaining} days left): ${article.title}`);
        }
      }

      console.log(`✅ ${category}: Removed ${removedCount} expired articles`);
      return removedCount;
    } catch (error) {
      console.error(`Error cleaning up category ${category}:`, error);
      return 0;
    }
  }

  async generateCleanupReport() {
    const report = {
      timestamp: new Date().toISOString(),
      categories: {},
      totalRemoved: 0,
      totalRemaining: 0
    };

    for (const category of this.categories) {
      try {
        const contentDir = path.join(__dirname, `../content/${category}`);
        const files = await fs.readdir(contentDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        report.categories[category] = {
          totalArticles: jsonFiles.length,
          articlesRemoved: 0 // Will be updated during cleanup
        };
        
        report.totalRemaining += jsonFiles.length;
      } catch (error) {
        console.log(`Category ${category} not found or empty`);
        report.categories[category] = {
          totalArticles: 0,
          articlesRemoved: 0
        };
      }
    }

    return report;
  }

  async run() {
    console.log('🧹 Starting content cleanup...');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('Removing articles older than 7 days...');

    const report = await this.generateCleanupReport();
    let totalRemoved = 0;

    // Clean up each category
    for (const category of this.categories) {
      const removedCount = await this.cleanupCategory(category);
      report.categories[category].articlesRemoved = removedCount;
      totalRemoved += removedCount;
    }

    report.totalRemoved = totalRemoved;
    report.totalRemaining = report.totalRemaining - totalRemoved;

    console.log('\n📊 Cleanup Summary:');
    console.log(`Total articles removed: ${totalRemoved}`);
    console.log(`Total articles remaining: ${report.totalRemaining}`);

    for (const [category, stats] of Object.entries(report.categories)) {
      console.log(`${category}: ${stats.articlesRemoved} removed, ${stats.totalArticles - stats.articlesRemoved} remaining`);
    }

    // Save cleanup report
    await fs.writeFile(
      path.join(__dirname, '../data/cleanup-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n🎉 Cleanup complete!');
    return report;
  }
}

// Run if called directly
if (require.main === module) {
  const cleanup = new ContentCleanup();
  cleanup.run().catch(console.error);
}

module.exports = ContentCleanup;