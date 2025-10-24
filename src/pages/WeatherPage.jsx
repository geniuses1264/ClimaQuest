

import React, { useEffect, useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import Weather from "../components/Weather";
import HourlyStrip from "../components/HourlyStrip";
import DailyGrid from "../components/DailyGrid";
import AstronomyPanel from "../components/AstronomyPanel";


import Skeletons from "../components/Skeletons";
import {
  fetchWeatherData,
  fetchForecastData,
  fetchAstronomyData,
 
} from "../services/api";
import { motion } from "framer-motion";

export default function WeatherPage() {
  const [coords, setCoords] = useState(null); // { latitude, longitude } or null
  const [queryOverride, setQueryOverride] = useState(null); // human readable location override
  const [weather, setWeather] = useState(null); // current weather object (from API)
  const [forecast, setForecast] = useState(null); // forecast object
  const [astronomy, setAstronomy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  
  const loadFromCache = useCallback((key) => {
    try {
      const v = sessionStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  }, []);

  // Attempt to use geolocation first (user can search to override)
  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) {
      // proceed without coords; user can search
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // Build a location query string used by the API functions:
  // If queryOverride exists, use it; else use "lat,lon"
  const getLocationQuery = useCallback(() => {
    if (queryOverride) return queryOverride;
    if (coords) return `${coords.latitude},${coords.longitude}`;
    return null;
  }, [coords, queryOverride]);


  // Main data loader: fetch current weather + 7-day forecast
  const loadWeatherAndForecast = useCallback(
    async (locQ) => {
      if (!locQ) return;
      setLoading(true);
      setError(null);
      try {
        // Try cache first
        const cacheKey = `weather_cache_${locQ}`;
        const cached = loadFromCache(cacheKey);
        if (cached) {
          // use cached payload directly to avoid reading stale outer 'weather' state
          setWeather(cached.weather);
          setForecast(cached.forecast);
          // derive image query from the cached weather payload
     
        } else {
         const w = await fetchWeatherData(locQ);
          const f = await fetchForecastData(locQ, 7);
          setWeather(w);
          setForecast(f);
      
          try {
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({ weather: w, forecast: f, ts: Date.now() })
            );
          } catch(err) {
             console.warn("Failed to cache weather data:", err);
          }
         
        }
      } catch (err) {
        console.error("[WeatherPage] loadWeatherAndForecast", err);
        setError("Failed to load weather. Please retry.");
      } finally {
        setLoading(false);
      }
    },
    [loadFromCache] 
  );


  // Trigger loader when coords or queryOverride change
  useEffect(() => {
    const q = getLocationQuery();
    if (!q) return;
    loadWeatherAndForecast(q);
  }, [coords, queryOverride, getLocationQuery, loadWeatherAndForecast]);

  // Astronomy: fetch for today when weather is available (non-blocking)
  useEffect(() => {
    if (!weather) return;
    (async () => {
      try {
        const localtime = weather.location?.localtime?.split?.(" ")?.[0];
        if (!localtime) return;
        const a = await fetchAstronomyData(getLocationQuery(), localtime);
        setAstronomy(a);
      } catch (err) {
        console.warn("Astronomy load failed", err);
      }
    })();
  }, [weather, getLocationQuery]);

  // Expose handler to receive search selection from SearchBar
  const handleSelectLocation = useCallback((locationString) => {
    // locationString is like "City, Region, Country" as produced by fetchSearchData results
    setQueryOverride(locationString);
    setCoords(null); // override geolocation
  }, []);

  // Retry action
  const handleRetry = async () => {
    const q = getLocationQuery();
    if (!q) return;
    await loadWeatherAndForecast(q);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-800 dark:from-[#071018] dark:to-[#04202a] transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
       

        <div className="mt-6">
          <SearchBar onSelect={handleSelectLocation} />
        </div>

        {loading ? (
          <div className="mt-6">
            <Skeletons />
          </div>
        ) : error ? (
          <div className="mt-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-sky-500 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="bg-white/6 dark:bg-[#071722]/60 backdrop-blur rounded-2xl p-4 md:p-6 lg:p-8 border border-white/10 dark:border-white/6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                  {/* Main weather card and details */}
                  <Weather
                    weather={weather}
                    forecast={forecast}
                    onRequestAstronomy={() => setAstronomy(null)} // placeholder if needed
                  />

                  {/* Hourly strip */}
                  <div className="mt-6">
                    <HourlyStrip weather={weather} forecast={forecast} />
                  </div>

                  {/* Daily grid */}
                  <div className="mt-6">
                   <DailyGrid forecast={forecast} />

                  </div>

                  {/* Astronomy */}
                  <div className="mt-6">
                    <AstronomyPanel
                      astronomy={astronomy}
                      locationQuery={getLocationQuery()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
