// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Redirect from "./components/Redirect";  // ✅ use Redirect, not RedirectHandler

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<App />} />

        {/* Redirect handler for short URLs */}
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
