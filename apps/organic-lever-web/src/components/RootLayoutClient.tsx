"use client";

import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Open sidebar by default on desktop, close on mobile
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navigation
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <main
        className={`flex-1 p-4 transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? "lg:ml-64" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
