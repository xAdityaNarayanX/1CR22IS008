
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StorageService } from "../services/StorageService";
import { LoggingMiddleware } from "../utils/LoggingMiddleware";

const Redirect = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urls = StorageService.getURLs();
    const urlData = urls.find((url) => url.shortCode === shortCode);

    if (urlData) {
      const now = new Date();

      if (new Date(urlData.expiresAt) > now) {
        
        const clickData = {
          timestamp: now.toISOString(),
          userAgent: navigator.userAgent,
        };
        StorageService.trackClick(shortCode, clickData);

        LoggingMiddleware.log("Redirecting to original URL", {
          shortCode,
          originalUrl: urlData.originalUrl,
        });

        window.location.href = urlData.originalUrl;
      } else {
        LoggingMiddleware.error("Short URL expired", { shortCode });
        alert("This short URL has expired.");
        navigate("/");
      }
    } else {
      LoggingMiddleware.error("Short URL not found", { shortCode });
      alert("Short URL not found.");
      navigate("/");
    }
  }, [shortCode, navigate]);

  return <p>Redirecting...</p>;
};

export default Redirect;
