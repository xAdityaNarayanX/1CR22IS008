
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import URLShortener from './components/URLShortener';
import Statistics from './components/Statistics';
import { LoggingMiddleware } from './utils/LoggingMiddleware';
import { StorageService } from './services/StorageService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    
    const storedUrls = StorageService.getURLs();
    setUrls(storedUrls);
    
    
    LoggingMiddleware.log('Application initialized', { timestamp: new Date().toISOString() });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    LoggingMiddleware.log('Tab changed', { tabIndex: newValue });
  };

  const handleNewShortURL = (newUrl) => {
    const updatedUrls = [...urls, newUrl];
    setUrls(updatedUrls);
    StorageService.saveURLs(updatedUrls);
    LoggingMiddleware.log('New short URL created', { shortCode: newUrl.shortCode });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="URL Shortener tabs">
            <Tab label="URL Shortener" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <URLShortener onNewShortURL={handleNewShortURL} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Statistics urls={urls} />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;