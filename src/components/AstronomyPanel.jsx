/**
 * AstronomyPanel.jsx
 * - Displays simple astronomy info: sunrise, sunset, moonrise, moonset, moon_phase, moon_illumination
 * - If astronomy prop is missing, shows a small loader or message
 */

import React from "react";

export default function AstronomyPanel({ astronomy, locationQuery }) {
  if (!astronomy) {
    return (
      <div className="bg-white/4 dark:bg-[#04202a]/30 border border-white/8 rounded-lg p-3">
        <div className="text-white text-sm">Astronomy data not available for {locationQuery}</div>
      </div>
    );
  }

  const astro = astronomy?.astronomy?.astro || astronomy?.astro || null;
  if (!astro) {
    return null;
  }

  return (
    <div className="bg-white/4 dark:bg-[#04202a]/30 border border-white/8 rounded-lg p-3">
      <h4 className="text-white font-semibold mb-2">Astronomy</h4>
      <div className="grid grid-cols-2 gap-2 text-sm text-sky-200">
        <div>
          <div className="text-xs">Sunrise</div>
          <div className="text-white font-medium">{astro.sunrise}</div>
        </div>
        <div>
          <div className="text-xs">Sunset</div>
          <div className="text-white font-medium">{astro.sunset}</div>
        </div>
        <div>
          <div className="text-xs">Moonrise</div>
          <div className="text-white font-medium">{astro.moonrise}</div>
        </div>
        <div>
          <div className="text-xs">Moonset</div>
          <div className="text-white font-medium">{astro.moonset}</div>
        </div>
        <div>
          <div className="text-xs">Phase</div>
          <div className="text-white font-medium">{astro.moon_phase}</div>
        </div>
        <div>
          <div className="text-xs">Illumination</div>
          <div className="text-white font-medium">{astro.moon_illumination}%</div>
        </div>
      </div>
    </div>
  );
}
