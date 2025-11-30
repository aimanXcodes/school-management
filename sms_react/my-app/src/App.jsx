import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";

import Layout from "./components/Layout";
import Accounts from "./pages/Accounts";
import Notices from "./pages/Notices";


function App() {
  const isLoggedIn = true; // Placeholder for now, will use token later

  return (
    <Router>
      <Routes>
       

        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path="/dashboard" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
        <Route path="/students" element={<Layout pageTitle="Students"><Students /></Layout>} />
        <Route path="/teachers" element={<Layout pageTitle="Teachers"><Teachers /></Layout>} />
        <Route path="/classes" element={<Layout pageTitle="Classes"><Classes /></Layout>} />
        <Route path="/accounts" element={<Layout pageTitle="Accounts"><Accounts /></Layout>} />
        <Route path="/attendance" element={<Layout pageTitle="Attendance"><Attendance /></Layout>} />
        <Route path="/notices" element={<Layout pageTitle="Notices"><Notices /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;


