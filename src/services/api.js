// Import axios for making API requests
import axios from "axios";


 // -- Helper to safely read and clean environment URLs --

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

// -- API CONFIGURATION --
// 🌦 WEATHER API

const WEATHER_BASE_URL = readEnvUrl(
  import.meta.env.VITE_WEATHER_BASE_URL,
  "https://api.weatherapi.com/v1",
  "Weather API Base URL"
);
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";


// 📸 PEXELS API

const PEXELS_BASE_URL = readEnvUrl(
  import.meta.env.VITE_PEXELS_BASE_URL,
  "https://api.pexels.com",
  "Pexels API Base URL"
);
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";


// 🧭 TRIPGO API

const TRIPGO_BASE_URL = readEnvUrl(
  import.meta.env.VITE_TRIPGO_BASE_URL,
  "https://tripgo.skedgo.com/satapp",
  "TripGo API Base URL"
);
const TRIPGO_API_KEY = import.meta.env.VITE_TRIPGO_API_KEY || "";


// -- AXIOS INSTANCES --


// Weather
export const WeatherApi = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  params: { key: WEATHER_API_KEY },
});

// Pexels
export const PexelsApi = axios.create({
  baseURL: PEXELS_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json", Authorization: PEXELS_API_KEY },
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


// -- WEATHER FUNCTIONS --

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
 // -- fetch hourly forecast --
export async function fetchHourlyForecast(location, hours = 7) {
  try {
    const data = await fetchForecastData(location, 1); // fetch 1-day forecast
    const allHours = data.forecast.forecastday[0].hour;
    return allHours.slice(0, hours);
  } catch (error) {
    console.error("[WeatherAPI] Error fetching hourly forecast:", error);
    throw error;
  }
}

// -- fetch multi-day forecast --
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
// -- fetch astronomy data --
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
// --fetch search data --
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


// -- PEXELS FUNCTIONS --

// -- fetch videos from pexels --
export async function searchPexelsVideos(query, per_page = 3) {
  if (!query) throw new Error("Search query is required");
  try {
    const res = await PexelsApi.get("/videos/search", { params: { query, per_page } });
    return res.data?.videos || [];
  } catch (error) {
    console.error("[PexelsAPI] Error fetching videos:", error);
    return [];
  }
}
// -- fetch photos from pexels --
export async function searchPexelsPhotos(query, per_page = 8) {
  if (!query) throw new Error("Search query is required");
  try {
    const res = await PexelsApi.get("/v1/search", { params: { query, per_page } });
    return res.data?.photos || [];
  } catch (error) {
    console.error("[PexelsAPI] Error fetching photos:", error);
    return [];
  }
}


// -- TRIPGO FUNCTIONS--

export async function fetchTripOptions(from, to) {
  if (!from || !to) throw new Error("From and To locations are required");
  try {
    const response = await TripGoApi.get("/v1/trip", { params: { from, to } });
    return response.data;
  } catch (error) {
    console.error("[TripGoAPI] Error fetching trip options:", error);
    throw error;
  }
}

// -- FETCHING LOCATION SUGGESTIONS --

// This uses WeatherAPI's "search.json" endpoint to suggest locations
export async function fetchLocationSuggestions(query) {
  if (!query) throw new Error("Search query is required");

  try {
    const response = await WeatherApi.get("search.json", {
      params: { q: query },
    });

    // Return the list of matched locations
    return response.data || [];
  } catch (error) {
    console.error("[WeatherAPI] Error fetching location suggestions:", error);
    return [];
  }
}
