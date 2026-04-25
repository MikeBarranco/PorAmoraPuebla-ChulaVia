import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import MapPage from './pages/MapPage'
import SearchPage from './pages/SearchPage'
import GovDashboard from './pages/GovDashboard'
import JoinPage from './pages/JoinPage'

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/buscar" element={<SearchPage />} />
        <Route path="/gobierno" element={<GovDashboard />} />
        <Route path="/unirse" element={<JoinPage />} />
      </Routes>
    </div>
  )
}
