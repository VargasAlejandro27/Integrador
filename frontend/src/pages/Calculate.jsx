import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS, CATEGORY_COLORS } from '../utils/colors'

export default function Calculate(){
  const [data, setData] = useState({ 
    carKm: 0, 
    publicTransportHours: 0,
    flights: 0,
    electricity: 0,
    gas: 0,
    diet: 'moderado',
    shopping: 0,
    recycles: false
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setData({...data, [name]: type === 'checkbox' ? checked : value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (res.ok && result.id) {
        navigate('/resultados/' + result.id)
      } else {
        setError(result.error || 'Error al calcular')
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message)
    }
  }

  return (
    <div className="page">
      <h2 style={{color: COLORS.primary, marginBottom: 24}}>📊 Calcular Huella de Carbono</h2>

      {error && <div style={{color: 'white', marginBottom:'20px', padding:'16px', backgroundColor: COLORS.danger, borderRadius:'10px', fontWeight: 400}}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{maxWidth:'900px'}}>
        
        {/* Transporte */}
        <fieldset style={{width: '100%', boxSizing: 'border-box', border: `1px solid ${CATEGORY_COLORS.transporte}`, borderLeft: `4px solid ${CATEGORY_COLORS.transporte}`, background: `${CATEGORY_COLORS.transporte}10`, paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', paddingTop: '15px'}}>
          <legend style={{color: CATEGORY_COLORS.transporte, fontWeight: 700}}>🚗 Transporte</legend>
          
          <div style={{marginBottom: 20}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 500, color: COLORS.textPrimary}}>
              Km en auto por semana
            </label>
            <input 
              type="number" 
              name="carKm" 
              value={data.carKm} 
              onChange={handleChange} 
              min="0"
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit'}}
            />
          </div>

          <div style={{marginBottom: 20}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 500, color: COLORS.textPrimary}}>
              Horas de transporte público por semana
            </label>
            <input 
              type="number"     
              name="publicTransportHours" 
              value={data.publicTransportHours} 
              onChange={handleChange} 
              min="0"
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit'}}
            />
          </div>

          <div style={{marginBottom: 0}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: COLORS.textPrimary}}>
              Vuelos por año
            </label>
            <input 
              type="number" 
              name="flights" 
              value={data.flights} 
              onChange={handleChange} 
              min="0"
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit'}}
            />
          </div>
        </fieldset>

        {/* Energía */}
        <fieldset style={{width: '100%', boxSizing: 'border-box', border: `1px solid ${CATEGORY_COLORS.energia}`, borderLeft: `4px solid ${CATEGORY_COLORS.energia}`, background: `${CATEGORY_COLORS.energia}10`, paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', paddingTop: '15px', marginTop: 24}}>
          <legend style={{color: CATEGORY_COLORS.energia, fontWeight: 700}}>⚡ Energía</legend>
          
          <div style={{marginBottom: 20}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: COLORS.textPrimary}}>
              Consumo eléctrico (kWh/mes)
            </label>
            <input 
              type="number" 
              name="electricity" 
              value={data.electricity} 
              onChange={handleChange} 
              min="0"
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit'}}
            />
          </div>

          <div style={{marginBottom: 0}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: COLORS.textPrimary}}>
              Consumo gas (m³/mes)
            </label>
            <input 
              type="number" 
              name="gas" 
              value={data.gas} 
              onChange={handleChange} 
              min="0"
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit'}}
            />
          </div>
        </fieldset>

        {/* Alimentación */}
        <fieldset style={{width: '100%', boxSizing: 'border-box', border: `1px solid ${CATEGORY_COLORS.alimentacion}`, borderLeft: `4px solid ${CATEGORY_COLORS.alimentacion}`, background: `${CATEGORY_COLORS.alimentacion}10`, paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', paddingTop: '15px', marginTop: 24}}>
          <legend style={{color: CATEGORY_COLORS.alimentacion, fontWeight: 700}}>🍽️ Alimentación</legend>
          
          <div style={{marginBottom: 0}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: COLORS.textPrimary}}>
              Tipo de dieta
            </label>
            <select 
              name="diet" 
              value={data.diet} 
              onChange={handleChange}
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit', background: 'white', cursor: 'pointer'}}
            >
              <option value="carnivoro">🥩 Carnívoro</option>
              <option value="moderado">🍗 Moderado (recomendado)</option>
              <option value="vegetariano">🥬 Vegetariano</option>
              <option value="vegano">🌱 Vegano</option>
            </select>
          </div>
        </fieldset>

        {/* Consumo */}
        <fieldset style={{width: '100%', boxSizing: 'border-box', border: `1px solid ${CATEGORY_COLORS.consumo}`, borderLeft: `4px solid ${CATEGORY_COLORS.consumo}`, background: `${CATEGORY_COLORS.consumo}10`, paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', paddingTop: '15px', marginTop: 24}}>
          <legend style={{color: CATEGORY_COLORS.consumo, fontWeight: 700}}>🛒 Consumo</legend>
          
          <div style={{marginBottom: 20}}>
            <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: COLORS.textPrimary}}>
              Compras por mes
            </label>
            <input 
              type="number" 
              name="shopping" 
              value={data.shopping} 
              onChange={handleChange} 
              min="0"
              style={{width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit'}}
            />
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <input 
              type="checkbox" 
              name="recycles" 
              checked={data.recycles} 
              onChange={handleChange}
              style={{width: 12, height: 12, cursor: 'pointer', accentColor: COLORS.primary}}
            />
            <label style={{fontWeight: 400, fontSize: '0.75rem', color: COLORS.textPrimary, cursor: 'pointer', margin: 0}}>
              ♻️ Reciclo mis productos
            </label>
          </div>
        </fieldset>

        <button 
          type="submit" 
          style={{
            marginTop: '28px',
            width: '100%',
            padding: '14px',
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🧮 Calcular Huella de Carbono
        </button>
      </form>
    </div>
  )
}
