const User = require('../models/User');
const Product = require('../models/Product');
const math = require('mathjs');

class RecommendationService {
  constructor() {
    this.userProductMatrix = null;
    this.productSimilarityMatrix = null;
  }

  async buildUserProductMatrix() {
    const users = await User.find().populate('purchaseHistory.productId');
    const products = await Product.find();
    
    const userIds = users.map(u => u._id);
    const productIds = products.map(p => p._id);
    
    // Initialize matrix with zeros
    this.userProductMatrix = math.zeros(userIds.length, productIds.length);
    
    // Fill matrix with ratings
    users.forEach((user, userIndex) => {
      user.purchaseHistory.forEach(history => {
        const productIndex = productIds.findIndex(p => p.equals(history.productId._id));
        if (productIndex !== -1 && history.rating) {
          this.userProductMatrix.set([userIndex, productIndex], history.rating);
        }
      });
    });
    
    return this.userProductMatrix;
  }

  async calculateProductSimilarity() {
    if (!this.userProductMatrix) {
      await this.buildUserProductMatrix();
    }
    
    const numProducts = this.userProductMatrix.size()[1];
    this.productSimilarityMatrix = math.zeros(numProducts, numProducts);
    
    // Calculate cosine similarity between products
    for (let i = 0; i < numProducts; i++) {
      for (let j = 0; j < numProducts; j++) {
        if (i === j) {
          this.productSimilarityMatrix.set([i, j], 1); // Similarity with itself is 1
        } else {
          const productI = this.userProductMatrix.subset(math.index(math.range(0, this.userProductMatrix.size()[0]), i));
          const productJ = this.userProductMatrix.subset(math.index(math.range(0, this.userProductMatrix.size()[0]), j));
          
          const dotProduct = math.dot(productI, productJ);
          const magnitudeI = math.norm(productI);
          const magnitudeJ = math.norm(productJ);
          
          const similarity = magnitudeI * magnitudeJ !== 0 
            ? dotProduct / (magnitudeI * magnitudeJ) 
            : 0;
            
          this.productSimilarityMatrix.set([i, j], similarity);
        }
      }
    }
    
    return this.productSimilarityMatrix;
  }

  async getRecommendationsForUser(userId, limit = 5) {
    const users = await User.find();
    const products = await Product.find();
    
    const userIndex = users.findIndex(u => u._id.equals(userId));
    if (userIndex === -1) return [];
    
    if (!this.productSimilarityMatrix) {
      await this.calculateProductSimilarity();
    }
    
    // Get products the user hasn't rated
    const unratedProducts = [];
    for (let i = 0; i < products.length; i++) {
      if (this.userProductMatrix.get([userIndex, i]) === 0) {
        unratedProducts.push(i);
      }
    }
    
    // Predict ratings for unrated products
    const predictions = unratedProducts.map(productIndex => {
      let weightedSum = 0;
      let similaritySum = 0;
      
      for (let j = 0; j < products.length; j++) {
        const rating = this.userProductMatrix.get([userIndex, j]);
        if (rating > 0) {
          const similarity = this.productSimilarityMatrix.get([productIndex, j]);
          weightedSum += similarity * rating;
          similaritySum += Math.abs(similarity);
        }
      }
      
      const predictedRating = similaritySum > 0 ? weightedSum / similaritySum : 0;
      return { productIndex, predictedRating };
    });
    
    // Sort by predicted rating and return top recommendations
    return predictions
      .sort((a, b) => b.predictedRating - a.predictedRating)
      .slice(0, limit)
      .map(pred => products[pred.productIndex]);
  }
}

module.exports = new RecommendationService();