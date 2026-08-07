import { useEffect } from 'react'
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
      <Navbar />

      <Routes>
        {/* if user authenticated, go to Home, else go to Login  */}
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} /> 

        {/* if user is not authenticated, go to Register, else go to Landing  */}
        <Route path='/register' element={!authUser ? <Register /> : <Navigate to='/' />} /> 

        {/* if user authenticated, go to Login, else go to Landing  */}
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} /> 
        
        {/* user's home tab  */}
        <Route path='/home' element={<Home />} /> 

        {/* user's chart tab */}
        <Route path='/chart' element={<Chart />} /> 
      </Routes>
    </div>
  )
}

export default App
