// Skeletons.jsx - small skeleton components with shimmer animation (inline style injection below)


import React from "react";

export default function Skeletons() {
  return (
    <div className="space-y-4">
      <div className="h-48 rounded-xl bg-gray-700/30 animate-shimmer" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="h-20 rounded-lg bg-gray-700/30 animate-shimmer" />
        <div className="h-20 rounded-lg bg-gray-700/30 animate-shimmer" />
        <div className="h-20 rounded-lg bg-gray-700/30 animate-shimmer" />
        <div className="h-20 rounded-lg bg-gray-700/30 animate-shimmer" />
      </div>
    </div>
  );
}

/* Inject minimal shimmer keyframes once */
if (typeof document !== "undefined" && !document.getElementById("clima-shimmer-style")) {
  const s = document.createElement("style");
  s.id = "clima-shimmer-style";
  s.innerHTML = `
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }
  .animate-shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 400px 100%;
    animation: shimmer 1.2s linear infinite;
  }
  `;
  document.head.appendChild(s);
}
