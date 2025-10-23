
 //WeatherCard.jsx
//Displays location, date/time, main temperature (large), condition, and detail tiles.
//Has a unit toggle Celsius / Fahrenheit (persisted in localStorage).
 // Uses Tailwind classes; responsive.


import React, { useState, useMemo } from "react";
import { FaTint, FaThermometerHalf, FaSolarPanel, FaWind, FaEye, FaCloudRain } from "react-icons/fa";
import { format } from "date-fns";

export default function Weather({ weather}) {
  const [unit, setUnit] = useState(() => localStorage.getItem("clima_unit") || "C");

  const toggleUnit = () => {
    const next = unit === "C" ? "F" : "C";
    setUnit(next);
    localStorage.setItem("clima_unit", next);
  };

  const locName = useMemo(() => {
    if (!weather?.location) return "";
    const { name, region, country } = weather.location;
    return [name, region, country].filter(Boolean).join(", ");
  }, [weather]);

  const localtime = weather?.location?.localtime || "";
  const localtimeStr = useMemo(() => {
    if (!localtime) return "";
    // assume format "YYYY-MM-DD HH:MM"
    try {
      const [d, t] = localtime.split(" ");
      const dt = new Date(`${d}T${t}:00`);
      return format(dt, "PPpp"); // localized
    } catch {
      return localtime;
    }
  }, [localtime]);

  const tempC = weather?.current?.temp_c;
  const tempF = weather?.current?.temp_f;
  const tempDisplay = unit === "C" ? `${Math.round(tempC)}°C` : `${Math.round(tempF)}°F`;
  const conditionText = weather?.current?.condition?.text || "";

  const details = [
    { label: "Humidity", value: weather?.current?.humidity ? `${weather.current.humidity}%` : "—", icon: <FaTint /> },
    { label: "Feels like", value: unit === "C" ? `${Math.round(weather?.current?.feelslike_c ?? 0)}°C` : `${Math.round(weather?.current?.feelslike_f ?? 0)}°F`, icon: <FaThermometerHalf /> },
    { label: "UV", value: weather?.current?.uv ?? "—", icon: <FaSolarPanel /> },
    { label: "Wind", value: weather?.current?.wind_kph ? `${weather.current.wind_kph} kph` : `${weather?.current?.wind_mph ?? "—"} mph`, icon: <FaWind /> },
    { label: "Visibility", value: weather?.current?.vis_km ? `${weather.current.vis_km} km` : `${weather?.current?.vis_miles ?? "—"} mi`, icon: <FaEye /> },
    { label: "Precip", value: `${weather?.current?.precip_mm ?? 0} mm`, icon: <FaCloudRain /> },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-semibold text-white">{locName}</h2>
          <p className="text-sm text-sky-200 mt-1">{localtimeStr}</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleUnit}
            className="px-3 py-1 rounded-full bg-white/6 text-white hover:shadow-[0_6px_24px_rgba(59,130,246,0.15)]"
            aria-pressed={unit === "C"}
            title="Toggle Celsius / Fahrenheit"
          >
            {unit}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-1 flex items-center gap-4">
          <img
            src={weather?.current?.condition?.icon?.replace(/^\/\//, "https://")}
            alt={conditionText}
            className="w-20 h-20 md:w-28 md:h-28"
          />
          <div>
            <div className="text-4xl md:text-6xl font-extrabold text-white leading-none">{tempDisplay}</div>
            <div className="text-sm md:text-base text-sky-200 mt-2">{conditionText}</div>
          </div>
        </div>

        {/* Detail tiles */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {details.map((d, i) => (
              <div key={i} className="bg-white/4 dark:bg-[#04202a]/30 border border-white/8 rounded-lg p-3 flex items-center gap-3">
                <div className="text-sky-300">{d.icon}</div>
                <div>
                  <div className="text-xs text-sky-200">{d.label}</div>
                  <div className="text-sm font-semibold text-white">{d.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
