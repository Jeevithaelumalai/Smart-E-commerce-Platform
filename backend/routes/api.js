const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationService = require('../services/recommendationService');
const searchService = require('../services/searchService');

// Product recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const recommendations = await recommendationService.getRecommendationsForUser(req.user._id);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NLP search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });
    
    const results = await searchService.search(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;