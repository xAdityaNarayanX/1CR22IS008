
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Redirect from "./components/Redirect";  

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<App />} />

        
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
