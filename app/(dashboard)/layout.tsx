"use client";

import { useState } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--bg-base)">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="pt-14 lg:ml-60">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}