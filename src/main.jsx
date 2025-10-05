import "@fontsource/montserrat/400.css"; // Regular
import "@fontsource/montserrat/600.css"; // SemiBold
import "@fontsource/montserrat/700.css"; // Bold
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
