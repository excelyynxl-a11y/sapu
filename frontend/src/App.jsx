import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Chart from './pages/Chart'
import Landing from './pages/Landing'
 
function App() {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]); 

  return (
    <div>
      <Toaster position="top-center" />
      <Navbar />

      <Routes>
        {/* landing page */}
        <Route path='/' element={authUser ? <Navigate to='/home' /> : <Landing />} /> 

        {/* signup page */}
        <Route path='/signup' element={!authUser ? <Register /> : <Navigate to='/home' />} /> 

        {/* login page */}
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/home' />} /> 
        
        {/* user's home tab  */}
        <Route path='/home' element={authUser ? <Home /> : <Navigate to='/login' />} /> 

        {/* user's chart tab */}
        <Route path='/chart' element={authUser ? <Chart /> : <Navigate to='/login' />} /> 
      </Routes>
    </div>
  )
}

export default App
