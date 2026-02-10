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
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <Link to="/" className="brand">EcoCalc</Link>
        </div>

        <nav className="topnav">
          <Link to="/">Inicio</Link>
          <Link to="/calcular">Calcular</Link>
          <Link to="/historial">Historial</Link>
          <Link to="/consejos">Consejos</Link>
          {user?.role === 'admin' && <a href="/admin/dashboard" className="admin-link">Admin</a>}
        </nav>

        <div className="top-actions">
          {user ? (
            <>
              <span className="user-chip">Hola, {user.name || user.email}</span>
              <button className="ghost" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link className="ghost" to="/login">Ingresar</Link>
              <Link className="btn" to="/registro">Crear cuenta</Link>
            </>
          )}
        </div>
      </header>

      <main className="page-shell">
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
