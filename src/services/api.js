// Import axios for making API requests
import axios from "axios";

const readEnvUrl = (envKey, defaultUrl, label) => {
  let base = defaultUrl;

  try {
    const raw = (envKey || "").toString().trim();
    if (raw) {
      if (/^https?:\/\//i.test(raw)) {
        base = raw.replace(/\/$/, ""); // remove trailing slash
      } else {
        console.warn(`[API] Ignored non-absolute ${label}:`, raw);
      }
    }
  } catch (e) {
    console.warn(`[API] Env read error for ${label}:`, e);
  }

  return base;
};

// -- Weather API --
const WEATHER_BASE_URL = readEnvUrl(
  import.meta.env.VITE_WEATHER_BASE_URL,
  "https://api.weatherapi.com/v1",
  "VITE_WEATHER_BASE_URL"
);
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";

// -- Pexels API --
const PEXELS_BASE_URL = readEnvUrl(
  import.meta.env.VITE_PEXELS_BASE_URL,
  "https://api.pexels.com",
  "VITE_PEXELS_BASE_URL"
);
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";

// -- TripGo API --
const TRIPGO_BASE_URL = readEnvUrl(
  import.meta.env.VITE_TRIPGO_BASE_URL,
  "https://tripgo.skedgo.com/satapp/",
  "VITE_TRIPGO_BASE_URL"
);
const TRIPGO_API_KEY = import.meta.env.VITE_TRIPGO_API_KEY || "";

// -- Axios instances --

// Weather
export const WeatherApi = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  params: { key: WEATHER_API_KEY },
});

// Pexels
export const PexelsApi = axios.create({
  baseURL: PEXELS_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    Authorization: PEXELS_API_KEY,
  },
});

// TripGo
export const TripGoApi = axios.create({
  baseURL: TRIPGO_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-TripGo-Key": TRIPGO_API_KEY,
  },
});

// --- Weather API functions ---
export async function fetchWeatherData(location) {
  if (!location) throw new Error("Location is required");

  try {
    const response = await WeatherApi.get("current.json", { params: { q: location } });
    return response.data;
  } catch (error) {
    console.error("[WeatherAPI] Error fetching current weather:", error);
    throw error;
  }
}

export async function fetchForecastData(location, days = 3) {
  if (!location || !(Number.isInteger(days) && days > 0))
    throw new Error("Location and valid days are required");

  try {
    const response = await WeatherApi.get("forecast.json", {
      params: { q: location, days },
    });
    return response.data;
  } catch (error) {
    console.error("[WeatherAPI] Error fetching forecast:", error);
    throw error;
  }
}

export async function fetchAstronomyData(location, date) {
  if (!location || !date) throw new Error("Location and date are required");

  try {
    const response = await WeatherApi.get("astronomy.json", {
      params: { q: location, dt: date },
    });
    return response.data;
  } catch (error) {
    console.error("[WeatherAPI] Error fetching astronomy data:", error);
    throw error;
  }
}

export async function fetchSearchData(query) {
  if (!query) throw new Error("Search query is required");

  try {
    const response = await WeatherApi.get("search.json", { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error("[WeatherAPI] Error fetching search data:", error);
    throw error;
  }
}

// --- Pexels API functions ---
export async function searchPexelsVideos(query, per_page = 3) {
  if (!query) throw new Error("Search query is required");
  try {
    const res = await PexelsApi.get("/videos/search", { params: { query, per_page } });
    return res.data?.videos || [];
  } catch (error) {
    console.error("Error fetching Pexels videos:", error);
    return [];
  }
}

export async function searchPexelsPhotos(query, per_page = 8) {
  if (!query) throw new Error("Search query is required");
  try {
    const res = await PexelsApi.get("/v1/search", { params: { query, per_page } });
    return res.data?.photos || [];
  } catch (error) {
    console.error("Error fetching Pexels photos:", error);
    return [];
  }
}
// --- TripGo API functions ---
export async function fetchTripOptions(from, to  ) {
  if (!from || !to) throw new Error("From and To locations are required");
  try {
   const response = await TripGoApi.get("/v1/trip", {
  params: { from, to },
    });

    return response.data;

  } catch (error) {
    console.error("[TripGoAPI] Error fetchnig trip options:", error);
    throw error;
    
  }
} 
