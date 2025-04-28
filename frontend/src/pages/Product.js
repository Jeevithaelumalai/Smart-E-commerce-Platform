import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import { Box, Typography, Button, Grid, Paper, Rating } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <Typography>Loading product...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/500x500'} 
              alt={product.name} 
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" gutterBottom color="primary">
            ${product.price}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={4.5} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              (24 reviews)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<AddShoppingCart />}
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Product;