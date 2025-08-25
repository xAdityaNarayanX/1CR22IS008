// src/components/RedirectHandler.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { StorageService } from '../services/StorageService';
import { LoggingMiddleware } from '../utils/LoggingMiddleware';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const redirect = async () => {
      try {
        LoggingMiddleware.log('Redirect attempt', { shortCode });
        
        const urls = StorageService.getURLs();
        const urlData = urls.find(url => url.shortCode === shortCode);
        
        if (!urlData) {
          setError('Short URL not found');
          LoggingMiddleware.log('Redirect failed - URL not found', { shortCode });
          return;
        }
        
    
        if (new Date(urlData.expiresAt) < new Date()) {
          setError('This short URL has expired');
          LoggingMiddleware.log('Redirect failed - URL expired', { shortCode });
          return;
        }
        

        const updatedUrls = urls.map(url => {
          if (url.shortCode === shortCode) {
            const clickData = url.clickData || [];
            
            clickData.push({
              timestamp: new Date().toISOString(),
              referrer: document.referrer || 'direct',
              device: navigator.userAgent,
              country: 'Unknown' 
            });
            
            return {
              ...url,
              clicks: (url.clicks || 0) + 1,
              clickData
            };
          }
          return url;
        });
        
        StorageService.saveURLs(updatedUrls);
        
    
        LoggingMiddleware.log('Redirect successful', { shortCode, originalUrl: urlData.originalUrl });
        window.location.href = urlData.originalUrl;
        
      } catch (err) {
        setError('An error occurred during redirect');
        LoggingMiddleware.log('Redirect error', { error: err.message, shortCode });
      } finally {
        setLoading(false);
      }
    };

    redirect();
  }, [shortCode]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Redirecting...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return null;
};

export default RedirectHandler;