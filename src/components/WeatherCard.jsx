
import React, { useEffect, useState, useRef } from "react";
import {
  fetchWeatherData as fetchWeather,
  fetchForecastData as fetchForecast,
  fetchSearchData,
} from "../services/api";

export default function WeatherCard({ hours = 7 }) {
  const [coords, setCoords] = useState(null);
  const [locationOverride, setLocationOverride] = useState(null); // string query from search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchRef = useRef(null);

  // --- Get Current Time Greeting ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  // --- Detect Geolocation ---
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to access your location.");
        setLoading(false);
      }
    );
  }, []);

  // --- Fetch Weather + Forecast (by coords OR override search string) ---
  useEffect(() => {
    // need either coords or an override string
    if (!coords && !locationOverride) return;
    let mounted = true;

    async function loadWeather() {
      setLoading(true);
      setError(null);
      try {
        const locQuery = locationOverride
          ? locationOverride
          : `${coords.latitude},${coords.longitude}`;

        const current = await fetchWeather(locQuery);
        const forecastData = await fetchForecast(locQuery, 7);

        if (!mounted) return;

        setWeather(current);

        // --- Hourly forecast ---
        const dayHours = forecastData?.forecast?.forecastday?.[0]?.hour || [];
        const localtime = current.location?.localtime || "";
        const hourIndex = parseInt(localtime.split(" ")[1]?.split(":")[0], 10);
        const start = Number.isNaN(hourIndex) ? new Date().getHours() : hourIndex;
        setHourly(dayHours.slice(start, start + hours));

        // --- Daily forecast ---
        setDaily(forecastData?.forecast?.forecastday || []);
      } catch (err) {
        console.error("[WeatherCard] load error:", err);
        setError("Failed to fetch weather data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWeather();
    return () => {
      mounted = false;
    };
  }, [coords, locationOverride, hours]);

  // --- Helpers ---
  function getUvLevel(uv) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  }

  // --- Search handlers ---
  async function handleSearchSubmit(e) {
    e?.preventDefault();
    setError(null);
    setSearchResults([]);
    const q = (searchQuery || "").trim();
    if (!q) {
      setError("Please enter a city or location to search.");
      return;
    }

    setLoadingSearch(true);
    try {
      const results = await fetchSearchData(q);
      // fetchSearchData is expected to return an array of location objects
      setSearchResults(Array.isArray(results) ? results : results?.locations ?? []);
      // focus results for keyboard users
      if (searchRef.current) searchRef.current.focus();
    } catch (err) {
      console.error("[WeatherCard] search error:", err);
      setError("Search failed. Check your API key or network.");
    } finally {
      setLoadingSearch(false);
    }
  }

  async function handleSelectResult(item) {
    // item shape from WeatherAPI search: { id?, name, region, country, url } — we'll build a query string
    const name = item?.name || item?.title || "";
    const region = item?.region ? `, ${item.region}` : "";
    const country = item?.country ? `, ${item.country}` : "";
    const query = `${name}${region}${country}`.trim();

    // Clear coords so geolocation won't override search results
    setCoords(null);
    setLocationOverride(query);
    // Clear search UI
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchResults([]);
    setLoadingSearch(false);
  }

  // keyboard: Enter triggers search
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
    if (e.key === "Escape") {
      handleClearSearch();
    }
  }

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6">
        {/* Centered search bar above skeleton */}
        <div className="w-full max-w-3xl px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative bg-white/6 backdrop-blur rounded-xl border border-white/10 p-2 flex items-center gap-2 shadow-md"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search city (e.g. London, Accra)"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-blue-200/60 px-3 py-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition text-sm"
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        <div className="max-w-5xl w-full mx-auto p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 via-blue-700/30 to-blue-500/20 backdrop-blur-xl shadow-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-blue-300/30 rounded w-1/3"></div>
            <div className="h-12 bg-blue-300/30 rounded"></div>
            <div className="h-48 bg-blue-300/30 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative bg-white/6 backdrop-blur rounded-xl border border-white/10 p-2 flex items-center gap-2 shadow-md"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search city (e.g. London, Accra)"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-blue-200/60 px-3 py-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition text-sm"
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="ml-2 text-sm text-blue-200/80"
              >
                Clear
              </button>
            )}
          </form>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <ul
              ref={searchRef}
              className="mt-2 max-h-56 overflow-auto rounded-xl bg-white/6 backdrop-blur border border-white/10 shadow-md"
            >
              {searchResults.map((r, i) => (
                <li
                  key={i}
                  className="px-4 py-2 cursor-pointer hover:bg-white/8 transition text-sm text-white flex justify-between"
                  onClick={() => handleSelectResult(r)}
                >
                  <span>{r.name}{r.region ? `, ${r.region}` : ""}</span>
                  <span className="text-blue-200/80">{r.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="max-w-5xl mx-auto p-6 text-center rounded-xl bg-red-50 text-red-600 font-semibold shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // --- Display Data ---
  const locName = `${weather?.location?.name || ""}${weather?.location?.region ? ", "+weather.location.region : ""}${weather?.location?.country ? ", "+weather.location.country : ""}`;
  const temp = weather?.current?.temp_c ?? weather?.current?.temp_f;
  const unit = weather?.current?.temp_c !== undefined ? "°C" : "°F";
  const conditionText = weather?.current?.condition?.text || "";
  const feelsLike = weather?.current?.feelslike_c ?? weather?.current?.feelslike_f;
  const humidity = weather?.current?.humidity;
  const uv = getUvLevel(weather?.current?.uv ?? 0);
  const wind = weather?.current?.wind_kph ?? weather?.current?.wind_mph;

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      {/* Centered Search Bar */}
      <div className="w-full max-w-3xl">
        <form
          onSubmit={handleSearchSubmit}
          className="relative bg-white/6 backdrop-blur rounded-xl border border-white/10 p-2 flex items-center gap-2 shadow-md"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search city (e.g. London, Accra)"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-blue-200/60 px-3 py-2"
            aria-label="Search city"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition text-sm"
            aria-label="Search"
          >
            {loadingSearch ? "Searching..." : "Search"}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-2 text-sm text-blue-200/80"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </form>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <ul
            ref={searchRef}
            className="mt-2 max-h-56 overflow-auto rounded-xl bg-white/6 backdrop-blur border border-white/10 shadow-md"
          >
            {searchResults.map((r, i) => (
              <li
                key={i}
                className="px-4 py-2 cursor-pointer hover:bg-white/8 transition text-sm text-white flex justify-between"
                onClick={() => handleSelectResult(r)}
              >
                <span>{r.name}{r.region ? `, ${r.region}` : ""}</span>
                <span className="text-blue-200/80">{r.country}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <article className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/30 via-blue-700/20 to-blue-500/10 text-white rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 border border-blue-300/20">
        <header className="text-center py-6 border-b border-blue-300/20">
          <h1 className="text-3xl font-bold tracking-wide text-blue-100">{getGreeting()} and welcome to ClimaQuest!</h1>
          <p className="text-lg text-blue-200 mt-1">{getGreeting()}</p>
        </header>

        <div className="flex flex-col md:flex-row">
          {/* Left: Weather info */}
          <div className="w-full md:w-2/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-blue-100">{locName}</h2>
                <p className="text-sm text-blue-200">{weather.location?.localtime}</p>
              </div>
              <div className="text-right">
                
                <p className="text-6xl font-bold text-blue-50 drop-shadow-md flex items-center">
                   <img
                src={weather.current?.condition?.icon?.replace(/^\/\//, "https://")}
                alt="condition"
                className="w-24 h-24 mx-auto"
              />
                  {Math.round(temp)}{unit}
                </p>
                <p className="text-blue-200 text-sm mt-1">{conditionText}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <WeatherDetail label="Humidity" value={`${humidity}%`} />
              <WeatherDetail label="Feels Like" value={`${Math.round(feelsLike)}${unit}`} />
              <WeatherDetail label="UV Index" value={uv} />
              <WeatherDetail label="Wind" value={`${wind} ${weather.current?.wind_kph ? "kph" : "mph"}`} />
            </div>

            {/* Hourly Forecast */}
            <section>
              <h3 className="text-blue-100 font-semibold mb-2">Next {hourly.length} Hours</h3>
              <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
                {hourly.map((h, idx) => (
                  <HourlyCard key={idx} hour={h} />
                ))}
              </div>
            </section>

            {/* Daily Forecast */}
            <section className="mt-6">
              <h3 className="text-blue-100 font-semibold mb-2">7-Day Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daily.map((d, idx) => (
                  <DailyCard key={idx} day={d} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}

// --- Subcomponents ---
function WeatherDetail({ label, value }) {
  return (
    <div className="bg-blue-800/30 border border-blue-300/20 rounded-lg p-4 text-center shadow-md hover:bg-blue-700/40 transition-all duration-300">
      <p className="text-xs text-blue-200">{label}</p>
      <p className="text-lg font-semibold text-blue-50">{value}</p>
    </div>
  );
}

function HourlyCard({ hour }) {
  const time = hour.time?.split(" ")[1] || hour.time;
  const temp = hour.temp_c ?? hour.temp_f;
  const icon = hour.condition?.icon?.replace(/^\/\//, "https://");
  return (
    <div className="min-w-[90px] bg-blue-800/30 rounded-lg p-3 text-center border border-blue-300/20 hover:bg-blue-700/40 transition-all duration-300">
      <p className="text-xs text-blue-200">{time}</p>
      <img src={icon} alt={hour.condition?.text} className="mx-auto my-1 w-10 h-10" />
      <p className="font-medium text-blue-50">
        {Math.round(temp)}{hour.temp_c !== undefined ? "°C" : "°F"}
      </p>
      <p className="text-xs text-blue-300">{hour.condition?.text}</p>
    </div>
  );
}

function DailyCard({ day }) {
  const date = day.date;
  const icon = day.day?.condition?.icon?.replace(/^\/\//, "https://");
  const temp = Math.round(day.day?.avgtemp_c ?? day.day?.avgtemp_f);
  return (
    <div className="bg-blue-800/30 border border-blue-300/20 rounded-lg p-3 text-center hover:bg-blue-700/40 transition-all duration-300">
      <p className="text-xs text-blue-200">{date}</p>
      <img src={icon} alt={day.day?.condition?.text} className="mx-auto my-1 w-10 h-10" />
      <p className="font-medium text-blue-50">{temp}°C</p>
      <p className="text-xs text-blue-300">{day.day?.condition?.text}</p>
    </div>
  );
}
// ...existing code...
