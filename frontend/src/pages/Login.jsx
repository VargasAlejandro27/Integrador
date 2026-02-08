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
    <div className="page" style={{display:'flex',justifyContent:'center'}}>
      <div style={{width:480}}>
        <div className="card">
          <h2>Iniciar sesión</h2>

          {error && <div className="error" style={{marginTop:12}}>{error}</div>}

          <form onSubmit={submit} style={{marginTop:12}}>
            <label>Email
              <input placeholder="tu@email.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </label>
            <label style={{marginTop:10}}>Contraseña
              <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </label>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:14}}>
              <button type="submit" className="btn">Entrar</button>
              <Link to="/registro" className="btn secondary">Crear cuenta</Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
