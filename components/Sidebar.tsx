"use client";

import React, { useState } from "react";
import {
  Home,
  MessageSquare,
  FileText,
  Settings,
  ChevronUp,
  LogOut,
  User,
  Activity,
  Circle,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  username: string;
  email: string;
  avatarUrl: string;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  username,
  email,
  avatarUrl,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd">("online");

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "pdf", label: "PDF Generator", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const statusColors = {
    online: "bg-emerald-500",
    away: "bg-amber-500",
    dnd: "bg-rose-500",
  };

  const statusLabels = {
    online: "Online",
    away: "Away",
    dnd: "Do Not Disturb",
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false); // Close mobile drawer on selection
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-zinc-50 border-r border-zinc-200/80 dark:bg-zinc-950 dark:border-zinc-900 transition-colors">
      {/* Top Brand / Nav Links */}
      <div className="space-y-6">
        {/* App Title Header */}
        <div className={`flex items-center gap-2.5 px-2 transition-all ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
            A
          </div>
          {!collapsed && (
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
              Application
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all relative ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-sm border border-zinc-200/50 dark:bg-zinc-900 dark:text-indigo-400 dark:border-zinc-800"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900/50"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
                
                {/* Visual Accent for Active Tab */}
                {isActive && !collapsed && (
                  <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Panel */}
      <div className="relative">
        {profileDropdownOpen && (
          <div
            className={`absolute bottom-full left-0 z-50 mb-2 w-full rounded-xl border border-zinc-200 bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-900 ${
              collapsed ? "min-w-[140px]" : ""
            }`}
          >
            <div className="border-b border-zinc-100 px-2 py-1.5 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Account</p>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">{email}</p>
            </div>
            
            <div className="py-1">
              {(["online", "away", "dnd"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setUserStatus(status);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 text-left"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusColors[status]}`}></span>
                  {statusLabels[status]}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleTabClick("settings")}
              className="w-full flex items-center gap-2 border-t border-zinc-100 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50 text-left"
            >
              <User className="h-3 w-3" /> Profile Settings
            </button>
          </div>
        )}

        {/* Profile Card */}
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className={`w-full flex items-center justify-between p-2 rounded-xl border border-zinc-200/50 bg-white shadow-sm hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800/50 hover:dark:border-zinc-800 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="h-7 w-7 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold uppercase dark:bg-indigo-950 dark:text-indigo-300">
                  {username.charAt(0)}
                </div>
              )}
              <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-zinc-900 ${statusColors[userStatus]}`}></span>
            </div>
            
            {!collapsed && (
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {username}
                </p>
                <p className="text-[9px] font-semibold text-zinc-400 truncate tracking-wider uppercase mt-0.5">
                  {statusLabels[userStatus]}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <ChevronUp className={`h-4 w-4 text-zinc-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Container */}
      <aside
        className={`hidden md:block h-screen sticky top-0 shrink-0 z-30 transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-out */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop mask */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Main slide content */}
          <aside className="relative flex w-64 max-w-[80vw] flex-col h-full bg-white animate-in slide-in-from-left duration-300 shadow-2xl z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
