const natural = require('natural');
const nlp = require('compromise');
const Product = require('../models/Product');

class SearchService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.initializeTfIdf();
  }

  async initializeTfIdf() {
    const products = await Product.find();
    products.forEach(product => {
      const text = `${product.name} ${product.description} ${product.tags.join(' ')}`;
      this.tfidf.addDocument(text.toLowerCase());
    });
  }

  async search(query) {
    // NLP processing to understand query intent
    const doc = nlp(query);
    const nouns = doc.nouns().out('array');
    const adjectives = doc.adjectives().out('array');
    
    // Extract keywords
    const keywords = [...nouns, ...adjectives];
    if (keywords.length === 0) keywords.push(query);
    
    // Find relevant products using TF-IDF
    const productScores = {};
    keywords.forEach(keyword => {
      this.tfidf.tfidfs(keyword.toLowerCase(), (i, measure) => {
        if (!productScores[i]) productScores[i] = 0;
        productScores[i] += measure;
      });
    });
    
    // Get sorted product IDs
    const sortedProducts = Object.entries(productScores)
      .sort((a, b) => b[1] - a[1])
      .map(([index]) => index);
    
    // Return actual products
    return Product.find({
      _id: { $in: sortedProducts.map(i => Product.find()[i]._id) }
    }).limit(10);
  }

  async semanticSearch(query, vector) {
    // This would use pre-computed embeddings (e.g., from OpenAI or similar)
    // For simplicity, we'll just do text search here
    return this.search(query);
  }
}

module.exports = new SearchService();