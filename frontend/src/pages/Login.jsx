import React, { useState, useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)
  const from = location.state?.from?.pathname || '/'

  const submit = async (e) =>{
    e.preventDefault()
    setError('')
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email.trim())) {
      setError('Correo inválido')
      return
    }
    if (password.length < 6) {
      setError('La contraseña es muy corta')
      return
    }
    try {
      const result = await login(email, password)
      if (result.success) {
        navigate(from, { replace: true })
      } else {
        setError(result.error || 'Login fallido')
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-grid">
        <div className="auth-card">
          <h2>Bienvenido de vuelta</h2>
          <p className="muted">Accede para seguir midiendo y descargar reportes.</p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={submit} className="auth-form">
            <label>Email
              <input placeholder="tu@email.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </label>
            <label>Contraseña
              <input placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </label>

            <button type="submit" className="btn full">Entrar</button>
            <Link to="/registro" className="ghost full" style={{textAlign:'center'}}>¿Nuevo? Crear cuenta</Link>
          </form>
        </div>

        <div className="auth-panel">
          <p className="label">Beneficios</p>
          <ul className="bullet-list">
            <li>Historial y PDF listos para compartir.</li>
            <li>Consejos personalizados por categoría.</li>
            <li>Acceso seguro con sesiones cifradas.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
