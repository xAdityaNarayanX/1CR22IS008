
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoggingMiddleware } from '../utils/LoggingMiddleware';

const Statistics = ({ urls }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      LoggingMiddleware.log('Expanded URL details', { shortCode: panel });
    }
  };

  const getDeviceInfo = () => {
    
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      return 'Mobile';
    } else if (/tablet/i.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  };

  const simulateClickData = (url) => {
    
    if (!url.clickData || url.clickData.length === 0) {
      const clickData = [];
      const count = Math.floor(Math.random() * 5) + 1; 
      
      for (let i = 0; i < count; i++) {
        const timeOffset = Math.floor(Math.random() * 48) + 1; 
        const timestamp = new Date(Date.now() - timeOffset * 60 * 60 * 1000);
        
        clickData.push({
          timestamp: timestamp.toISOString(),
          referrer: i % 2 === 0 ? 'direct' : 'social_media',
          device: getDeviceInfo(),
          country: i % 3 === 0 ? 'US' : i % 3 === 1 ? 'UK' : 'IN'
        });
      }
      
      return clickData;
    }
    
    return url.clickData;
  };

  if (urls.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          URL Statistics
        </Typography>
        <Alert severity="info">
          No URLs have been shortened yet. Go to the URL Shortener tab to create your first short URL.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      
      <Typography variant="body1" paragraph>
        Analytics for your shortened URLs. Click on a URL to view detailed click information.
      </Typography>

      {urls.map((url, index) => {
        const clickData = simulateClickData(url);
        const isExpired = new Date(url.expiresAt) < new Date();
        
        return (
          <Accordion 
            key={index} 
            expanded={expanded === `panel${index}`} 
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    {url.shortUrl}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {url.originalUrl}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Chip 
                    label={`${clickData.length} clicks`} 
                    color="primary" 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <Chip 
                    label={isExpired ? 'Expired' : 'Active'} 
                    color={isExpired ? 'error' : 'success'} 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="caption" display="block">
                    Created: {new Date(url.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>
                Click Details
              </Typography>
              
              {clickData.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No clicks recorded for this URL yet.
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Referrer</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>Country</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clickData.map((click, clickIndex) => (
                        <TableRow key={clickIndex}>
                          <TableCell>
                            {new Date(click.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={click.referrer} 
                              size="small" 
                              color="secondary" 
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>{click.device}</TableCell>
                          <TableCell>{click.country}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default Statistics;