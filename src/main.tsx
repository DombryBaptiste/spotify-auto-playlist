import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import Callback from "./Callback";

// Composant pour restaurer la route après le redirect du 404.html
// eslint-disable-next-line react-refresh/only-export-components
function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      delete sessionStorage.redirect;
      navigate(redirect);
    }
  }, [navigate]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/spotify-auto-playlist">
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
