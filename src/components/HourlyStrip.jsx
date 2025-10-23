/**
 * HourlyStrip.jsx
 * - Displays next 7 hours starting from local hour (uses forecast for day 1)
 * - Horizontal scroll on small screens, visible on large screens
 */

import React, { useMemo } from "react";
import { format } from "date-fns";

export default function HourlyStrip({ weather, forecast }) {
  const hourly = useMemo(() => {
    try {
      const curLocaltime = weather?.location?.localtime?.split?.(" ")?.[1] || null;
      const startHour = curLocaltime ? parseInt(curLocaltime.split(":")[0], 10) : new Date().getHours();
      const dayHours = forecast?.forecast?.forecastday?.[0]?.hour || [];
      const slice = dayHours.slice(startHour, startHour + 7);
      return slice;
    } catch {
      return [];
    }
  }, [weather, forecast]);

  if (!hourly || hourly.length === 0) return null;

  return (
    <div>
      <h3 className="text-white font-semibold mb-2">Next {hourly.length} Hours</h3>
      <div className="flex gap-3 overflow-x-auto py-2">
        {hourly.map((h, idx) => (
          <div key={idx} className="min-w-[110px] flex-shrink-0 bg-white/4 dark:bg-[#04202a]/30 border border-white/8 rounded-lg p-3 text-center">
            <div className="text-xs text-sky-200 mb-1">{format(new Date(h.time), "HH:mm")}</div>
            <img src={h.condition?.icon?.replace(/^\/\//, "https://")} alt={h.condition?.text} className="mx-auto w-10 h-10" />
            <div className="text-sm font-semibold text-white">{Math.round(h.temp_c ?? h.temp_f)}°</div>
            <div className="text-xs text-sky-300 mt-1">{h.chance_of_rain ?? h.will_it_rain ?? 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
