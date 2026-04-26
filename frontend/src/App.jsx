import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import MapPage from './pages/MapPage'
import SearchPage from './pages/SearchPage'
import GovDashboard from './pages/GovDashboard'
import JoinPage from './pages/JoinPage'

/* CSS de transición entre páginas */
const PAGE_TRANSITION_CSS = `
  @keyframes cv-page-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cv-page-wrapper {
    animation: cv-page-in 0.3s ease both;
  }
`

export default function App() {
  const location = useLocation()

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

  /* Desactivar restauracion automatica de scroll del browser */
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  /* Scroll al top en cada cambio de ruta (incluyendo regresar) */
  useEffect(() => {
    window.scrollTo(0, 0)
    // Refuerzo por si el render tarda
    const t = setTimeout(() => window.scrollTo(0, 0), 10)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <style>{PAGE_TRANSITION_CSS}</style>
      <Navbar />

      {/* key fuerza re-mount en cada ruta → dispara la animación de entrada */}
      <main
        key={location.pathname}
        className="cv-page-wrapper"
        style={{ flex: 1 }}
      >
        <Routes location={location}>
          <Route path="/"         element={<Landing />} />
          <Route path="/mapa"     element={<MapPage />} />
          <Route path="/buscar"   element={<SearchPage />} />
          <Route path="/gobierno" element={<GovDashboard />} />
          <Route path="/unirse"   element={<JoinPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
