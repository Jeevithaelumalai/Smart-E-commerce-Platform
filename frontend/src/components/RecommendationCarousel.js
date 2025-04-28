import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../services/api';
import { Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';

function RecommendationCarousel({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations(userId);
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) fetchRecommendations();
  }, [userId]);

  if (loading) return <Typography>Loading recommendations...</Typography>;
  if (!recommendations.length) return null;

  return (
    <div style={{ padding: '20px 0' }}>
      <Typography variant="h6" gutterBottom>
        Recommended For You
      </Typography>
      <Grid container spacing={2}>
        {recommendations.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default RecommendationCarousel;