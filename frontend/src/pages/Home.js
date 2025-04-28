import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import RecommendationCarousel from '../components/RecommendationCarousel';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { Grid, Typography } from '@mui/material';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Get from auth context in real app

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) return <Typography>Loading products...</Typography>;

  return (
    <div style={{ padding: '20px' }}>
      <SearchBar />
      <RecommendationCarousel userId={userId} />
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        All Products
      </Typography>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;