// ...existing code...
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import Welcome from "./pages/Welcome"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"
import About from "./pages/About"
import Footer from "./components/Footer" // ✅ import Footer
import WeatherPage from "./pages/WeatherPage"
import Favorite from "./pages/Favorite"
import TripPlanner from "./pages/TripPlanner"
function ConditionalNavbar() {
  const location = useLocation()
  return location.pathname !== "/" ? <Navbar /> : null
}

function ConditionalFooter() {
  const location = useLocation()
  // ✅ Show Footer on all pages (including "/")
  return <Footer />
}

function App() {
  return (
    <BrowserRouter>
      {/* Conditional Navbar */}
      <ConditionalNavbar />

      {/* Main content area */}
      <div className="min-h-screen flex flex-col justify-between">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/trip" element={<TripPlanner />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer always at the bottom */}
        <ConditionalFooter />
      </div>
    </BrowserRouter>
  )
}

export default App;
