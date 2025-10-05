// import { BrowserRouter, Route, Routes } from "react-router-dom"
//  import Welcome from "./pages/Welcome"
//  import Dashboard from "./pages/Dashboard"
//  import Navbar from "./components/Navbar"
// function App() {


//   return (
//     <>
//    <BrowserRouter>
   
//    <Routes>
//       <Route path="/" element={<Welcome />} />
//    </Routes>

//    <Navbar />
//    <Routes>
//      <Route  path="Dashboard" element={<Dashboard />} />
//    </Routes>
//    </BrowserRouter>
//     </>
//   )
// }

// export default App

// ...existing code...

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
 import Welcome from "./pages/Welcome"
 import Dashboard from "./pages/Dashboard"
 import Navbar from "./components/Navbar"
function App() {

  function ConditionalNavbar() {
    const location = useLocation()
    return location.pathname !== "/" ? <Navbar /> : null
  }

  return (
    <>
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
