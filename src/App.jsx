
// src/App.jsx
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
 import Welcome from "./pages/Welcome"
 import Dashboard from "./pages/Dashboard"
 import Navbar from "./components/Navbar"
 
function App() {
// Conditional renderring of Navbar Based on Route
  function ConditionalNavbar() {
    const location = useLocation()
    return location.pathname !== "/" ? <Navbar /> : null
  }
// End of Conditional rederring of navbar based on route
  return (
    <>
    {/*Wrap the entire app in BrowserRouter to enabele routing */}  
   <BrowserRouter>
   
   <Routes>
    
      <Route path="/" element={<Welcome />} />
      <Route path="dashboard" element={<Dashboard />} />
   </Routes>

   <ConditionalNavbar />
   </BrowserRouter>
    </>
  )
}

export default App
