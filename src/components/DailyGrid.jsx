
 // DailyGrid.jsx
 // - Displays 7-day forecast from forecast.forecastday



import { format } from "date-fns";

export default function DailyGrid({ forecast }) {
  const days = forecast?.forecast?.forecastday || [];
  if (!days.length) return null;

  return (
    <div>
      <h3 className="text-white font-semibold mb-2">3-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((d, i) => {
          const date = new Date(d.date);
          const weekday = format(date, "EEE");
          const icon = d.day?.condition?.icon?.replace(/^\/\//, "https://");
          return (
            <div key={i} className="bg-white/4 dark:bg-[#04202a]/30 border border-white/8 rounded-lg p-3 text-center">
              <div className="text-xs text-sky-200">{weekday}</div>
              <img src={icon} alt={d.day?.condition?.text} className="mx-auto w-10 h-10 my-2" />
              <div className="text-sm font-semibold text-white">{Math.round(d.day?.mintemp_c)}° / {Math.round(d.day?.maxtemp_c)}°</div>
              <div className="text-xs text-sky-300 mt-1">{Math.round(d.day?.daily_chance_of_rain ?? 0)}% • {d.day?.totalprecip_mm ?? 0}mm</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
