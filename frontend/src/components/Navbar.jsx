import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BarChart3, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const hiddenPaths = ['/', '/login', '/signup']
  if (hiddenPaths.includes(location.pathname)) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.log('Error in logout:', error)
    }
  }

  return (
    <nav className="navbar">
      {/* home button */}
      <button
        className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
        onClick={() => navigate('/home')}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      {/* chart button */}
      <button
        className={`nav-item ${location.pathname === '/chart' ? 'active' : ''}`}
        onClick={() => navigate('/chart')}
      >
        <BarChart3 size={22} />
        <span>Charts</span>
      </button>

      {/* logout button */}
      <button className="nav-item" onClick={handleLogout}>
        <LogOut size={22} />
        <span>Logout</span>
      </button>
    </nav>
  )
}

export default Navbar
