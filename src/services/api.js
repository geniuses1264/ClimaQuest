// api.js - refined

import axios from "axios";

/* ----------------------------- Helpers ----------------------------- */

const readEnvUrl = (envValue, defaultUrl, label) => {
  try {
    const raw = (envValue || "").toString().trim();
    if (raw && /^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
  } catch (e) {
    console.warn(`[API] Env read error for ${label}:`, e);
  }
  return defaultUrl;
};

const handleAxiosError = (err, prefix = "[API]") => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMsg = err.response?.data?.error?.message || err.response?.data?.message || err.response?.statusText;
    const message = serverMsg ? `${prefix} ${status} - ${serverMsg}` : `${prefix} ${err.message}`;
    const e = new Error(message);
    e.original = err;
    return e;
  }
  return err instanceof Error ? err : new Error(String(err));
};

/* ----------------------------- Config ----------------------------- */

const WEATHER_BASE_URL = readEnvUrl(import.meta.env.VITE_WEATHER_BASE_URL, "https://api.weatherapi.com/v1", "Weather API Base URL");
const WEATHER_API_KEY = (import.meta.env.VITE_WEATHER_API_KEY || "").trim();

const PEXELS_BASE_URL = readEnvUrl(import.meta.env.VITE_PEXELS_BASE_URL, "https://api.pexels.com", "Pexels API Base URL");
const PEXELS_API_KEY = (import.meta.env.VITE_PEXELS_API_KEY || "").trim();

/* ----------------------------- Axios Instances ----------------------------- */

export const WeatherApi = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  params: WEATHER_API_KEY ? { key: WEATHER_API_KEY } : {},
});

export const PexelsApi = axios.create({
  baseURL: PEXELS_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json", Authorization: PEXELS_API_KEY || "" },
});

/* Optional: attach simple request/response logging during development */
if (import.meta.env.DEV) {
  WeatherApi.interceptors.request.use((cfg) => { console.debug("[WeatherApi] req:", cfg.url, cfg.params || ""); return cfg; });

  WeatherApi.interceptors.response.use((r) => { return r; }, (e) => { console.warn("[WeatherApi] resp error:", e?.response?.status, e?.message); return Promise.reject(e); });

  PexelsApi.interceptors.request.use((cfg) => { console.debug("[PexelsApi] req:", cfg.url, cfg.params || ""); return cfg; });


  PexelsApi.interceptors.response.use((r) => r, (e) => { console.warn("[PexelsApi] resp error:", e?.response?.status, e?.message); return Promise.reject(e); });
}

/* ----------------------------- WeatherAPI functions ----------------------------- */

 
export async function fetchWeatherData(location) {
  if (!WEATHER_API_KEY) {
    const msg = "Missing WeatherAPI key. Set VITE_WEATHER_API_KEY in your .env and restart dev server.";
    console.error("[WeatherAPI] " + msg);
    throw new Error(msg);
  }
  if (!location) throw new Error("fetchWeatherData: location is required");

  try {
    const res = await WeatherApi.get("current.json", { params: { q: location } });
    return res.data;
  } catch (err) {
    throw handleAxiosError(err, "[WeatherAPI] Error fetching current weather:");
  }
}
// fetchForecastData(location, days = 7)

export async function fetchForecastData(location, days = 7) {
  if (!WEATHER_API_KEY) {
    const msg = "Missing WeatherAPI key. Set VITE_WEATHER_API_KEY in your .env and restart dev server.";
    console.error("[WeatherAPI] " + msg);
    throw new Error(msg);
  }
  if (!location || !(Number.isInteger(days) && days > 0)) throw new Error("fetchForecastData: valid location and days are required");

  try {
    const res = await WeatherApi.get("forecast.json", { params: { q: location, days } });
    return res.data;
  } catch (err) {
    throw handleAxiosError(err, "[WeatherAPI] Error fetching forecast:");
  }
}


// fetchAstronomyData(location, date)
 //- date: YYYY-MM-DD (string)
// - returns WeatherAPI astronomy.json response object
 //
export async function fetchAstronomyData(location, date) {
  if (!WEATHER_API_KEY) {
    const msg = "Missing WeatherAPI key. Set VITE_WEATHER_API_KEY in your .env and restart dev server.";
    console.error("[WeatherAPI] " + msg);
    throw new Error(msg);
  }
  if (!location || !date) throw new Error("fetchAstronomyData: location and date are required");

  try {
    const res = await WeatherApi.get("astronomy.json", { params: { q: location, dt: date } });
    return res.data;
  } catch (err) {
    throw handleAxiosError(err, "[WeatherAPI] Error fetching astronomy data:");
  }
}

// fetchSearchData(query)
// returns WeatherAPI search.json response (array)
 
export async function fetchSearchData(query) {
  if (!WEATHER_API_KEY) {
    const msg = "Missing WeatherAPI key. Set VITE_WEATHER_API_KEY in your .env and restart dev server.";
    console.error("[WeatherAPI] " + msg);
    throw new Error(msg);
  }
  if (!query) throw new Error("fetchSearchData: query is required");

  try {
    const res = await WeatherApi.get("search.json", { params: { q: query } });
    // WeatherAPI returns an array of matched locations
    return res.data;
  } catch (err) {
    // Return empty array for UI-friendly behavior or rethrow depending on needs
    const wrapped = handleAxiosError(err, "[WeatherAPI] Error fetching search data:");
    console.error(wrapped.message);
    throw wrapped;
  }
  
}

const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY;


//--- Convenience helpers -------

export async function fetchHourlyForecast(location, hours = 7) {
  if (!location) throw new Error("fetchHourlyForecast: location is required");
  try {
    const data = await fetchForecastData(location, 1);
    const hoursArr = data?.forecast?.forecastday?.[0]?.hour || [];
    // caller may slice using localtime; return full hours array for flexibility
    return hoursArr.slice(0, hours);
  } catch (err) {
    throw handleAxiosError(err, "[WeatherAPI] Error fetching hourly forecast:");
  }
}

//----------------------------- Pexels functions ----------------------------- 
export async function searchPexelsPhotos(query, per_page = 8) {
  if (!query) throw new Error("searchPexelsPhotos: query is required");
  if (!PEXELS_API_KEY) {
    console.error("[PexelsAPI] Missing Pexels API key. Set VITE_PEXELS_API_KEY in .env.");
    return [];
  }

  const cacheKey = `pexels_cache_${query}_${per_page}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.warn("[PexelsAPI] Cache read failed:", err);
  }

  try {
    const res = await PexelsApi.get("/v1/search", { params: { query, per_page } });
    const photos = res.data?.photos || [];

    if (photos.length > 0) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(photos));
      } catch (err) {
        console.warn("[PexelsAPI] Cache write failed:", err);
      }
    }

    return photos;
  } catch (err) {
    console.error("[PexelsAPI] Error fetching photos:", err?.response?.status, err?.message || err);
    return [];
  }
}


/**
 * searchPexelsVideos(query, per_page = 3)
 * - returns res.data or { videos: [] } on error
 */
export async function searchPexelsVideos(query, per_page = 3) {
  if (!query) throw new Error("searchPexelsVideos: query is required");
  if (!PEXELS_API_KEY) return { videos: [] };

  try {
    const res = await PexelsApi.get("/videos/search", { params: { query, per_page } });
    if (import.meta.env.DEV) console.debug("[PexelsAPI] searchPexelsVideos:", { query, per_page, status: res.status });
    return res.data || { videos: [] };
  } catch (err) {
    console.error("[PexelsAPI] Error fetching videos:", err?.response?.status, err?.message || err);
    return { videos: [] };
  }
}

//------------- Combined helpers (optional) ---------- 

export async function getWeatherWithImage(location) {
  if (!location) throw new Error("getWeatherWithImage: location is required");
  const weatherData = await fetchWeatherData(location);
  const conditionText = weatherData?.current?.condition?.text || "weather";
  let imageUrl = null;
  try {
    const photosRes = await searchPexelsPhotos(conditionText, 1);
    // photosRes may be { photos: [...] } or an array; normalize
    const photos = Array.isArray(photosRes) ? photosRes : photosRes.photos || [];
    imageUrl = photos[0]?.src?.landscape || photos[0]?.src?.original || null;
  } catch (err) {
    console.warn("[getWeatherWithImage] image fetch failed:", err);
  }

  return {
    weather: weatherData,
    imageUrl,
  };
}

/* ----------------------------- Export summary ----------------------------- */

export default {
  fetchWeatherData,
  fetchForecastData,
  fetchAstronomyData,
  fetchSearchData,
  fetchHourlyForecast,
  searchPexelsPhotos,
  searchPexelsVideos,
  getWeatherWithImage,
};
