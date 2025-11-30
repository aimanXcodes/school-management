// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children, pageTitle }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar fills full height and scrollable if needed */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header stays at top */}
        <Header pageTitle={pageTitle} />
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default Layout;



