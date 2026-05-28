"use client";

import React from "react";
import { MessageSquare, FileText, Activity, Clock, Zap, ArrowUpRight } from "lucide-react";

interface HomeTabProps {
  username: string;
  onNavigate: (tab: string) => void;
}

export default function HomeTab({ username, onNavigate }: HomeTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-lg shadow-indigo-500/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl"></div>
        
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Zap className="h-3 w-3 fill-yellow-400 text-yellow-400" /> System Active
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {username}!
          </h2>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Your premium productivity hub is running flawlessly. Generate beautiful document reports, chat with the AI assistant, or adjust developer settings.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("chat")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Chat <MessageSquare className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("pdf")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white border border-white/20 transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
            >
              Build PDF <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Active Chats",
            value: "28",
            change: "+12.5% vs yesterday",
            icon: MessageSquare,
            color: "text-blue-500 bg-blue-500/10",
            barColor: "bg-blue-500",
            percent: 70,
          },
          {
            title: "PDFs Generated",
            value: "142",
            change: "+8.3% this week",
            icon: FileText,
            color: "text-indigo-500 bg-indigo-500/10",
            barColor: "bg-indigo-500",
            percent: 85,
          },
          {
            title: "System Latency",
            value: "14 ms",
            change: "Stable performance",
            icon: Clock,
            color: "text-emerald-500 bg-emerald-500/10",
            barColor: "bg-emerald-500",
            percent: 94,
          },
          {
            title: "API Status",
            value: "Active",
            change: "All systems operational",
            icon: Activity,
            color: "text-purple-500 bg-purple-500/10",
            barColor: "bg-purple-500",
            percent: 100,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {stat.change}
              </span>
            </div>
            
            {/* Elegant Micro progress bar */}
            <div className="mt-4 w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div
                className={`h-full ${stat.barColor} transition-all duration-500`}
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Graph & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Graph Panel */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">Analytics Overview</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Monthly tracking of platform request counts</p>
            </div>
            <select className="text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          {/* SVG Graph */}
          <div className="relative h-60 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Horizontal Gridlines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/60" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/60" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/60" strokeDasharray="4 4" />
              
              {/* Chart Shaded Area */}
              <path
                d="M 0 200 L 0 160 L 80 120 L 160 140 L 240 70 L 320 85 L 400 30 L 500 45 L 500 200 Z"
                fill="url(#chartGlow)"
              />
              
              {/* Chart Glowing Line */}
              <path
                d="M 0 160 L 80 120 L 160 140 L 240 70 L 320 85 L 400 30 L 500 45"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data Dots */}
              {[
                { x: 0, y: 160 },
                { x: 80, y: 120 },
                { x: 160, y: 140 },
                { x: 240, y: 70 },
                { x: 320, y: 85 },
                { x: 400, y: 30 },
                { x: 500, y: 45 },
              ].map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.x}
                  cy={dot.y}
                  r="5"
                  className="fill-white stroke-indigo-600 dark:fill-zinc-900 transition-all hover:r-7 duration-200 cursor-pointer"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            
            {/* Timeline Labels */}
            <div className="flex justify-between mt-3 text-[10px] font-semibold text-zinc-400 px-1 uppercase tracking-wider">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Activity Stream Panel */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">Recent Activities</h3>
            <span className="text-[10px] rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 uppercase">Live</span>
          </div>

          <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
            {[
              {
                text: "Document generated",
                meta: "invoice_may_2026.pdf",
                time: "2 mins ago",
                color: "bg-blue-500",
              },
              {
                text: "AI response stream",
                meta: "Assisted user request successfully",
                time: "14 mins ago",
                color: "bg-indigo-500",
              },
              {
                text: "Theme preference updated",
                meta: "Toggled to system dark mode",
                time: "1 hour ago",
                color: "bg-purple-500",
              },
              {
                text: "API Handshake pinged",
                meta: "Reported healthy status (14ms)",
                time: "2 hours ago",
                color: "bg-emerald-500",
              },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                <div className="relative flex flex-col items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${activity.color} shrink-0 mt-1`}></div>
                  {idx !== 3 && <div className="w-0.5 flex-1 bg-zinc-100 dark:bg-zinc-800 my-1"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    {activity.text}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{activity.meta}</p>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
