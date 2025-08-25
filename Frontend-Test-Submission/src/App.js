
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import URLShortener from "./components/URLShortener";
import Redirect from "./components/Redirect";

const App = () => {
  const [shortUrls, setShortUrls] = useState([]);

  const handleNewShortURL = (urlData) => {
    setShortUrls((prev) => [...prev, urlData]);
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<URLShortener onNewShortURL={handleNewShortURL} />} />
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </div>
  );
};

export default App;
