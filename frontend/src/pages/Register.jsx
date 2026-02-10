import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register } = useContext(AuthContext)

  const submit = async (e) =>{
    e.preventDefault()
    setError('')

    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim().toLowerCase()
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError('Correo inválido')
      return
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      return
    }

    try {
      const result = await register({
        name: trimmedName,
        email: trimmedEmail,
        password: form.password,
        passwordConfirm: form.confirmPassword
      })
      if (result.success) {
        alert('Cuenta creada exitosamente. Iniciando sesión...')
        navigate('/')
      } else {
        setError(result.error || 'Registro fallido')
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-grid">
        <div className="auth-card">
          <h2>Crea tu cuenta</h2>
          <p className="muted">Tendrás historial, reportes y consejos personalizados.</p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={submit} className="auth-form">
            <label>Nombre
              <input placeholder="Tu nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required minLength={2} />
            </label>
            <label>Email
              <input placeholder="tu@email.com" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            </label>
            <label>Contraseña
              <input placeholder="Mínimo 8 caracteres" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required minLength={8} />
            </label>
            <label>Confirmar Contraseña
              <input placeholder="Repite contraseña" type="password" value={form.confirmPassword} onChange={e=>setForm({...form, confirmPassword:e.target.value})} required minLength={8} />
            </label>

            <button type="submit" className="btn full">Crear cuenta</button>
            <Link to="/login" className="ghost full" style={{textAlign:'center'}}>¿Ya tienes cuenta? Inicia sesión</Link>
          </form>
        </div>

        <div className="auth-panel">
          <p className="label">Incluye</p>
          <ul className="bullet-list">
            <li>Historial ilimitado de cálculos.</li>
            <li>PDF listos para enviar.</li>
            <li>Consejos priorizados por impacto.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
