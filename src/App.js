import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebsiteBuilder from "./WebsiteBuilder";
import PreviewPage from "./PreviewPage";
import MainLayout from "./MainLayout";
import Login from "./Login";
import './index.css';
import 'flowbite';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<WebsiteBuilder />} />
      <Route path="/login" element={<Login />} />
      <Route path="/preview" element={<PreviewPage />} />
        <Route path="/main" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
