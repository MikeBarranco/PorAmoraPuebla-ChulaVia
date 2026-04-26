import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import MapPage from './pages/MapPage'
import SearchPage from './pages/SearchPage'
import GovDashboard from './pages/GovDashboard'
import JoinPage from './pages/JoinPage'

export default function App() {
  /* Spotlight: sigue el cursor en secciones azules (.cv-cyber-bg) */
  useEffect(() => {
    function onMove(e) {
      const el = e.target.closest('.cv-cyber-bg')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mouse-x', `${e.clientX - r.left}px`)
      el.style.setProperty('--mouse-y', `${e.clientY - r.top}px`)
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/mapa"     element={<MapPage />} />
        <Route path="/buscar"   element={<SearchPage />} />
        <Route path="/gobierno" element={<GovDashboard />} />
        <Route path="/unirse"   element={<JoinPage />} />
      </Routes>
    </div>
  )
}
