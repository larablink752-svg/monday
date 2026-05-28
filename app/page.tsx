"use client";

import React, { useState, useEffect } from "react";
import { PanelLeft, Sparkles, Menu, ShieldAlert } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HomeTab from "@/components/HomeTab";
import ChatTab from "@/components/ChatTab";
import PDFTab from "@/components/PDFTab";
import SettingsTab from "@/components/SettingsTab";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  
  // Shared profile state synchronizing settings input immediately with sidebar profile card
  const [username, setUsername] = useState<string>("Username");
  const [email, setEmail] = useState<string>("user@example.com");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
  );

  const handleUpdateProfile = (name: string, mail: string, avatar: string) => {
    if (name.trim()) setUsername(name);
    if (mail.trim()) setEmail(mail);
    setAvatarUrl(avatar);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "home":
        return "Dashboard";
      case "chat":
        return "Chat Assistant";
      case "pdf":
        return "PDF Generator Workspace";
      case "settings":
        return "System Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        username={username}
        email={email}
        avatarUrl={avatarUrl}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation Strip */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/80 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-500 md:hidden dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            {/* Layout Collapse Toggle Button [|] matching reference image */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="hidden md:flex p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-500 hover:text-indigo-600 transition-all dark:border-zinc-800 dark:hover:bg-zinc-900/50 dark:hover:text-indigo-400 cursor-pointer"
            >
              <PanelLeft className="h-4.5 w-4.5" />
            </button>

            {/* Ambient status dot */}
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Sparkles className="h-3 w-3 fill-indigo-600 dark:fill-indigo-400" /> Premium Suite
            </span>
          </div>
        </header>

        {/* Inner Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Dynamic View Title */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white transition-all">
                {getTabTitle()}
              </h1>
            </div>

            {/* View Switching */}
            <div className="relative">
              {activeTab === "home" && (
                <HomeTab username={username} onNavigate={setActiveTab} />
              )}
              
              {activeTab === "chat" && (
                <ChatTab />
              )}
              
              {activeTab === "pdf" && (
                <PDFTab />
              )}
              
              {activeTab === "settings" && (
                <SettingsTab
                  username={username}
                  email={email}
                  avatarUrl={avatarUrl}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
