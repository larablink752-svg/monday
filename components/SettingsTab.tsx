"use client";

import React, { useState, useEffect } from "react";
import { Settings, Moon, Sun, User, Bell, Sliders, Shield, CheckCircle2 } from "lucide-react";

interface SettingsTabProps {
  username: string;
  email: string;
  avatarUrl: string;
  onUpdateProfile: (name: string, email: string, avatar: string) => void;
}

export default function SettingsTab({
  username,
  email,
  avatarUrl,
  onUpdateProfile,
}: SettingsTabProps) {
  const [nameInput, setNameInput] = useState(username);
  const [emailInput, setEmailInput] = useState(email);
  const [avatarInput, setAvatarInput] = useState(avatarUrl);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync with document element's dark class on load
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const handleToggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSave = () => {
    onUpdateProfile(nameInput, emailInput, avatarInput);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Settings className="h-5.5 w-5.5 text-indigo-500" /> Account Preferences
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your dashboard preferences, theme layers, and profile metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details (Updates Sidebar Profile) */}
        <div className="md:col-span-2 space-y-4 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-zinc-400" /> Profile Customizer
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Full Username
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="User name"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatarInput}
              onChange={(e) => setAvatarInput(e.target.value)}
              placeholder="Provide photo URL"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Profile Changes
            </button>
          </div>
        </div>

        {/* System Settings & Dark Mode Toggle */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-zinc-400" /> UI Settings
            </h3>

            {/* Dark Mode Switcher */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  {isDarkMode ? <Moon className="h-3.5 w-3.5 text-indigo-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                  Dark Theme
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Toggle overall color mode</p>
              </div>
              
              <button
                onClick={handleToggleDarkMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isDarkMode ? "bg-indigo-600" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </button>
            </div>

            {/* Notification settings */}
            <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-zinc-400" />
                  Live Notifications
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Show success/failure toasts</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-indigo-600" />
            </div>

            {/* Dev settings */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-zinc-400" />
                  Developer Mode
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Display connection outputs</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-white border border-zinc-200 p-4 shadow-xl flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-5 dark:bg-zinc-900 dark:border-zinc-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-white">Profile Updated</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Dashboard metadata saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
