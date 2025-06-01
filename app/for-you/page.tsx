"use client";

import { useState } from "react";
import ForYouContent from "@/components/ForYouContent";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";

export default function ForYou() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="dashboard-container">
        <div>
          <SearchBar isSidebarOpen={isSidebarOpen} />
        </div>
        <div>
          <ForYouContent />
        </div>
      </div>
    </>
  );
}
