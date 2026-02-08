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
    
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('Mínimo 6 caracteres')
      return
    }

    try {
      const result = await register({
        name: form.name,
        email: form.email,
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
    <div className="page">
      <h2>Crear cuenta</h2>
      {error && <div style={{color:'#d32f2f', marginBottom:'10px', padding:'10px', backgroundColor:'#ffebee', borderRadius:'5px'}}>{error}</div>}
      <form onSubmit={submit}>
        <label>Nombre
          <input placeholder="Tu nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </label>
        <label>Email
          <input placeholder="tu@email.com" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        </label>
        <label>Contraseña
          <input placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        </label>
        <label>Confirmar Contraseña
          <input placeholder="Repite contraseña" type="password" value={form.confirmPassword} onChange={e=>setForm({...form, confirmPassword:e.target.value})} required />
        </label>
        <button type="submit">Crear cuenta</button>
      </form>
      <p style={{textAlign:'center', marginTop:'15px'}}>
        ¿Ya tienes cuenta? <Link to="/login" style={{color:'#27AE60'}}>Inicia sesión aquí</Link>
      </p>
    </div>
  )
}
