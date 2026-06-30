import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Terms from './pages/Terms.jsx'
import Invoice from './pages/Invoice.jsx'
import TrainingPlan from './pages/TrainingPlan.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/training-plan" element={<TrainingPlan />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
