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
    setError('')

    const numericFields = ['carKm', 'publicTransportHours', 'flights', 'electricity', 'gas', 'shopping']
    for (const field of numericFields) {
      const value = Number(data[field])
      if (!Number.isFinite(value) || value < 0) {
        setError('Todos los valores numéricos deben ser mayores o iguales a 0')
        return
      }
    }

    if (!data.diet) {
      setError('Selecciona un tipo de dieta')
      return
    }
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
    <div className="page page-split">
      <div className="panel">
        <div className="panel-header">
          <h2>📊 Calcular Huella de Carbono</h2>
          <p className="muted">Completa los campos clave; validamos datos negativos automáticamente.</p>
        </div>

        {error && <div className="alert-banner danger">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <fieldset className="form-section transporte">
            <legend>🚗 Transporte</legend>

            <label className="stack">
              <span>Kilómetros en auto por semana</span>
              <input type="number" name="carKm" value={data.carKm} onChange={handleChange} min="0" />
            </label>

            <label className="stack">
              <span>Horas de transporte público por semana</span>
              <input type="number" name="publicTransportHours" value={data.publicTransportHours} onChange={handleChange} min="0" />
            </label>

            <label className="stack">
              <span>Vuelos por año</span>
              <input type="number" name="flights" value={data.flights} onChange={handleChange} min="0" />
            </label>
          </fieldset>

          <fieldset className="form-section energia">
            <legend>⚡ Energía</legend>

            <label className="stack">
              <span>Consumo eléctrico (kWh/mes)</span>
              <input type="number" name="electricity" value={data.electricity} onChange={handleChange} min="0" />
            </label>

            <label className="stack">
              <span>Consumo de gas (m³/mes)</span>
              <input type="number" name="gas" value={data.gas} onChange={handleChange} min="0" />
            </label>
          </fieldset>

          <fieldset className="form-section alimentacion">
            <legend>🍽️ Alimentación</legend>
            <label className="stack">
              <span>Tipo de dieta</span>
              <select name="diet" value={data.diet} onChange={handleChange}>
                <option value="carnivoro">🥩 Carnívoro</option>
                <option value="moderado">🍗 Moderado (recomendado)</option>
                <option value="vegetariano">🥬 Vegetariano</option>
                <option value="vegano">🌱 Vegano</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="form-section consumo">
            <legend>🛒 Consumo</legend>

            <label className="stack">
              <span>Compras por mes</span>
              <input type="number" name="shopping" value={data.shopping} onChange={handleChange} min="0" />
            </label>

            <label className="inline-check">
              <input type="checkbox" name="recycles" checked={data.recycles} onChange={handleChange} />
              <span>♻️ Reciclo mis productos</span>
            </label>
          </fieldset>

          <button type="submit" className="btn full">🧮 Calcular huella</button>
        </form>
      </div>

      <aside className="panel panel-accent">
        <h3>Cómo funciona</h3>
        <ul className="bullet-list">
          <li>Validamos que los valores no sean negativos antes de enviar.</li>
          <li>Los resultados se guardan en tu historial con tu sesión.</li>
          <li>Recibirás consejos priorizados por impacto y esfuerzo.</li>
        </ul>

        <div className="stat-strip">
          <div className="stat-pill">Transporte • mayor peso</div>
          <div className="stat-pill alt">Energía • optimiza kWh</div>
          <div className="stat-pill warm">Consumo • recicle y reduzca</div>
        </div>

        <div className="mini-card">
          <p className="label">Tips rápidos</p>
          <p className="muted">Agrupa compras, reduce vuelos cortos y ajusta termostato: suelen recortar hasta 18%.</p>
        </div>
      </aside>
    </div>
  )
}
