# 🌤️ Climber Quest

> A sleek, modern weather forecast web app built with **React**, **Tailwind CSS**, and **OpenWeather API** — providing real-time weather insights and a 7-day forecast.

---

## 📋 Quick Copy
Copy everything in this README easily 👇  
**[📋 Copy All](#)** *(Click to select and copy all text)*

---

## 🚀 Project Overview

**Climber Quest** is a modern weather web app designed to help users stay informed about weather conditions across any location. It integrates geolocation and search features, displays detailed forecasts, and offers a visually appealing interface powered by **React** and **Tailwind CSS**.

The app is built to be **simple, accurate, and responsive**, giving users access to:

- Real-time current weather updates  
- A detailed **7-day forecast**  
- Hourly weather breakdown  
- Astronomy information (sunrise, sunset, moon phase)  
- A clean, minimal, and elegant design  

---

## 🌍 Core Features

### 🧭 Search & Geolocation
- Automatically detects your location (with permission)
- Option to manually search for any city or region

### 🌦️ 7-Day Forecast
- Fetches weather data from **OpenWeather API**
- Displays minimum and maximum temperatures for each day
- Uses friendly emojis for a clean and modern look

### 🕒 Hourly Forecast
- Shows upcoming hourly temperature trends and weather conditions

### 🌌 Astronomy Panel
- Displays sunrise, sunset, and moon data for your current or searched location

### 💬 Dynamic Greeting
- Displays a friendly message based on time of day (e.g., *Good Morning ☀️*, *Good Evening 🌙*)

### 🦶 Footer
- Displays project name, copyright,
  and your name: **Ebenezer**

---

## 🛠️ Technologies Used

| Tool | Purpose |
|------|----------|
| **React.js** | Core framework for building the UI |
| **Tailwind CSS** | For modern, responsive, and clean styling |
| **OpenWeather API** | Provides 7-day weather forecast data |
| **Framer Motion** | Adds smooth animations and transitions |
| **Date-fns** | For date formatting in forecasts |
| **Session Storage** | Caches weather data for faster reloads |

---

## 📁 Project Structure


src/
├── components/
│ ├── SearchBar.jsx
│ ├── Weather.jsx
│ ├── HourlyStrip.jsx
│ ├── DailyGrid.jsx
  |__ Navbar.jsx
│ ├── AstronomyPanel.jsx
│ └── Footer.jsx
│ └── Skeletons.jsx
│ └── ImageGallery.jsx
│ └── WeatherCard.jsx
   
│
├── pages/
│ └── Dashboard.jsx
│ └── WeatherPage.jsx
│ └── GTripPlanner.jsx
│ └── Favorite.jsx
│ └── About.jsx
│
├── services/
│ └── api.js
│
├── App.jsx
├── main.js
└── index.css

---

## 🌱 Future Updates

🚧 **Coming Soon**
- **Trip Planner Page** → Plan trips with weather insights for chosen destinations  
- **Favorites Page** → Save favorite locations for quick weather access  

These features will be integrated in the next update to make **Climber Quest** more personalized and useful.

---

## 🧠 How It Works

1. On load, the app requests permission to access your location.  
2. It fetches **current weather**, **7-day forecast**, and **astronomy** data.  
3. You can search any city manually if you deny geolocation.  
4. The UI updates dynamically to show:
   - Current temperature and condition  
   - 7-day forecast cards  
   - Hourly temperature strip  
   - Astronomy info  

---

## 👨‍💻 Developer

**Ebenezer**  
A passionate front-end developer crafting user-friendly web experiences.  
> _“Blending weather data with artful design.”_

---

## ⚡ Quick Start (Local Setup)

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/climber-quest.git
   cd climber-quest
