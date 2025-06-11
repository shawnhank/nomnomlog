import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router'
import './index.css'
import App from './pages/App/App'
import { initializeTheme } from './utils/themeUtils'

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
