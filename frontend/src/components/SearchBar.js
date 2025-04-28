import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton, Paper, List, ListItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchProducts } from '../services/api';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSuggestions([]);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      try {
        const results = await searchProducts(value, true);
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for products..."
          value={query}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
      
      {suggestions.length > 0 && (
        <Paper style={{ position: 'absolute', width: '100%', zIndex: 1 }}>
          <List>
            {suggestions.map(item => (
              <ListItem 
                button 
                key={item._id} 
                onClick={() => {
                  setQuery(item.name);
                  setSuggestions([]);
                  navigate(`/product/${item._id}`);
                }}
              >
                {item.name}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
}

export default SearchBar;