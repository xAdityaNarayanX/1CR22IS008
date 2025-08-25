// src/services/StorageService.js
// Service for handling client-side storage
export const StorageService = {
  getURLs: () => {
    try {
      const urls = localStorage.getItem('shortenedUrls');
      return urls ? JSON.parse(urls) : [];
    } catch (error) {
      console.error('Error retrieving URLs from storage:', error);
      return [];
    }
  },
  
  saveURLs: (urls) => {
    try {
      localStorage.setItem('shortenedUrls', JSON.stringify(urls));
    } catch (error) {
      console.error('Error saving URLs to storage:', error);
    }
  },
  
  // For demo purposes, we'll also store click data in localStorage
  // In a real application, this would be handled by a backend
  trackClick: (shortCode, clickData) => {
    try {
      const urls = StorageService.getURLs();
      const updatedUrls = urls.map(url => {
        if (url.shortCode === shortCode) {
          return {
            ...url,
            clicks: (url.clicks || 0) + 1,
            clickData: [...(url.clickData || []), clickData]
          };
        }
        return url;
      });
      
      StorageService.saveURLs(updatedUrls);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }
};