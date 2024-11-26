"use client";

import HeaderNav from "@/components/HeaderNav";
import SidebarNav from "@/components/SidebarNav";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100">
      <HeaderNav toggleSidebar={() => setIsOpen(!isOpen)} />
      <SidebarNav isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="p-4 lg:ml-64 pt-20 max-w-7xl mx-auto">
        <div className="w-full max-w-[1200px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
