// src/components/URLShortener.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LoggingMiddleware } from '../utils/LoggingMiddleware';
import { StorageService } from '../services/StorageService';

const URLShortener = ({ onNewShortURL }) => {
  const [urlForms, setUrlForms] = useState([
    { originalUrl: '', validity: '', shortCode: '', errors: {} }
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [generalError, setGeneralError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateShortCode = (code) => {
    if (!code) return true; 
    const regex = /^[a-zA-Z0-9_-]{1,20}$/;
    return regex.test(code);
  };

  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.originalUrl) {
      errors.originalUrl = 'URL is required';
    } else if (!validateUrl(formData.originalUrl)) {
      errors.originalUrl = 'Please enter a valid URL';
    }
    
    if (formData.validity && (isNaN(formData.validity) || formData.validity < 1)) {
      errors.validity = 'Validity must be a positive number';
    }
    
    if (!validateShortCode(formData.shortCode)) {
      errors.shortCode = 'Short code can only contain letters, numbers, hyphens, and underscores (max 20 characters)';
    } else if (formData.shortCode) {
      
      const existingUrls = StorageService.getURLs();
      if (existingUrls.some(url => url.shortCode === formData.shortCode)) {
        errors.shortCode = 'This short code is already in use';
      }
    }
    
    return errors;
  };

  const handleInputChange = (index, field, value) => {
    const newForms = [...urlForms];
    newForms[index][field] = value;
    
    
    if (newForms[index].errors[field]) {
      delete newForms[index].errors[field];
    }
    
    setUrlForms(newForms);
  };

  const addUrlForm = () => {
    if (urlForms.length >= 5) {
      setGeneralError('Maximum 5 URLs allowed at once');
      LoggingMiddleware.log('Attempted to add more than 5 URL forms', { currentCount: urlForms.length });
      return;
    }
    
    setUrlForms([...urlForms, { originalUrl: '', validity: '', shortCode: '', errors: {} }]);
    setGeneralError('');
    LoggingMiddleware.log('Added new URL form', { formCount: urlForms.length + 1 });
  };

  const removeUrlForm = (index) => {
    if (urlForms.length <= 1) return;
    
    const newForms = [...urlForms];
    newForms.splice(index, 1);
    setUrlForms(newForms);
    LoggingMiddleware.log('Removed URL form', { formCount: newForms.length });
  };

  const generateShortCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleSubmit = (index) => {
    const formData = urlForms[index];
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
      const newForms = [...urlForms];
      newForms[index].errors = errors;
      setUrlForms(newForms);
      LoggingMiddleware.log('Form validation failed', { errors, formData });
      return;
    }
    
    
    const shortCode = formData.shortCode || generateShortCode();
    const validity = formData.validity ? parseInt(formData.validity) : 30;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validity * 60000);
    
    const shortUrl = `${window.location.origin}/${shortCode}`;
    
    const urlData = {
      originalUrl: formData.originalUrl,
      shortCode,
      shortUrl,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      clicks: 0,
      clickData: []
    };
    
    
    const existingUrls = StorageService.getURLs();
    const updatedUrls = [...existingUrls, urlData];
    StorageService.saveURLs(updatedUrls);
    
    
    setShortenedUrls([...shortenedUrls, urlData]);
    onNewShortURL(urlData);
    
    
    const newForms = [...urlForms];
    newForms[index] = { originalUrl: '', validity: '', shortCode: '', errors: {} };
    setUrlForms(newForms);
    
    LoggingMiddleware.log('URL shortened successfully', { shortCode, originalUrl: formData.originalUrl });
  };

  const handleSubmitAll = () => {
    urlForms.forEach((_, index) => {
      handleSubmit(index);
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      
      {generalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {generalError}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {urlForms.map((form, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                URL #{index + 1}
                {urlForms.length > 1 && (
                  <Chip 
                    label="Remove" 
                    color="error" 
                    size="small" 
                    onClick={() => removeUrlForm(index)}
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    value={form.originalUrl}
                    onChange={(e) => handleInputChange(index, 'originalUrl', e.target.value)}
                    error={!!form.errors.originalUrl}
                    helperText={form.errors.originalUrl}
                    placeholder="https://example.com"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={form.validity}
                    onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                    error={!!form.errors.validity}
                    helperText={form.errors.validity || "Optional, default: 30 min"}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Custom Short Code"
                    value={form.shortCode}
                    onChange={(e) => handleInputChange(index, 'shortCode', e.target.value)}
                    error={!!form.errors.shortCode}
                    helperText={form.errors.shortCode || "Optional, auto-generated if empty"}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => handleSubmit(index)}
                    disabled={!form.originalUrl}
                  >
                    Shorten URL
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addUrlForm}
          disabled={urlForms.length >= 5}
        >
          Add Another URL
        </Button>
        
        {urlForms.length > 1 && (
          <Button
            variant="contained"
            onClick={handleSubmitAll}
          >
            Shorten All URLs
          </Button>
        )}
      </Box>
      
      {shortenedUrls.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Recently Shortened URLs
          </Typography>
          
          <Grid container spacing={2}>
            {shortenedUrls.map((url, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                        {url.shortUrl}
                      </a>
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original: {url.originalUrl}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Expires: {new Date(url.expiresAt).toLocaleString()}
                    </Typography>
                    
                    <Chip 
                      label="Copy" 
                      size="small" 
                      onClick={() => {
                        navigator.clipboard.writeText(url.shortUrl);
                        LoggingMiddleware.log('URL copied to clipboard', { shortCode: url.shortCode });
                      }}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default URLShortener;