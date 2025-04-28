import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl || 'https://via.placeholder.com/345x140'}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description.substring(0, 100)}...
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/product/${product._id}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;