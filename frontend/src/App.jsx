import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Calculate from './pages/Calculate'
import Results from './pages/Results'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'
import Tips from './pages/Tips'
import RequireAuth from './auth/RequireAuth'
import { AuthContext } from './auth/AuthProvider'

export default function App(){
  const { user, logout } = React.useContext(AuthContext)
  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/calcular">Calcular</Link>
        <Link to="/historial">Historial</Link>
        <Link to="/consejos">Consejos</Link>
        {user ? (
          <>
            {user.role === 'admin' && <a href="/admin/dashboard" style={{color:'#2b6cb0',fontWeight:600}}>Admin</a>}
            <button onClick={handleLogout} style={{background:'transparent',border:0,color:'#27AE60',fontWeight:600,cursor:'pointer'}}>Salir</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/calcular" element={<RequireAuth><Calculate/></RequireAuth>} />
          <Route path="/resultados/:id" element={<RequireAuth><Results/></RequireAuth>} />
          <Route path="/historial" element={<RequireAuth><History/></RequireAuth>} />
          <Route path="/consejos" element={<Tips/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/registro" element={<Register/>} />
        </Routes>
      </main>
    </div>
  )
}
