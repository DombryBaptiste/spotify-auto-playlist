import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Callback from "./Callback";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
