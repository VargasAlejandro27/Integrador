import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LEVEL_COLORS, CATEGORY_COLORS, COLORS } from '../utils/colors'

export default function Results(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    fetch('/api/resultados/' + id, { credentials: 'include' })
      .then(r=> {
        if (!r.ok) throw new Error('No autorizado')
        return r.json()
      })
      .then(data=>{
        setResult(data)
        setLoading(false)
      })
      .catch(err=>{
        setError('Error: ' + err.message)
        setLoading(false)
      })
  },[id])

  if (loading) return <div className="page">Cargando...</div>
  if (error) return <div className="page"><p style={{color: COLORS.danger}}>{error}</p><a href="/historial">Volver</a></div>
  if (!result) return <div className="page">Cálculo no encontrado</div>

  const { emissions } = result
  const total = emissions?.total || 0
  const levelData = LEVEL_COLORS[emissions?.level] || LEVEL_COLORS.promedio

  return (
    <div className="page">
      <h2>Tus Resultados</h2>
      
      <div style={{background: levelData.bg, color:'white', padding:'28px', borderRadius:'12px', textAlign:'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto 24px auto'}}>
        <h3 style={{margin: '0 0 8px 0'}}>Total: {total} kg CO₂/año</h3>
        <p style={{fontSize:'18px', textTransform:'uppercase', margin:'0', fontWeight: 700, letterSpacing: '0.5px'}}>{emissions?.level}</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'16px', marginBottom:'28px'}}>
        <div style={{background: LEVEL_COLORS.excelente.light, padding:'16px', borderRadius:'10px', borderLeft:`4px solid ${COLORS.primary}`}}>
          <h4 style={{margin: '0 0 8px 0'}}>🚗 Transporte</h4>
          <p style={{margin:'0', fontSize:'20px', fontWeight:'bold', color: COLORS.primary}}>{emissions?.transport} kg</p>
        </div>
        <div style={{background: LEVEL_COLORS.promedio.light, padding:'16px', borderRadius:'10px', borderLeft:`4px solid ${CATEGORY_COLORS.energia}`}}>
          <h4 style={{margin: '0 0 8px 0'}}>⚡ Energía</h4>
          <p style={{margin:'0', fontSize:'20px', fontWeight:'bold', color: CATEGORY_COLORS.energia}}>{emissions?.energy} kg</p>
        </div>
        <div style={{background: LEVEL_COLORS.alto.light, padding:'16px', borderRadius:'10px', borderLeft:`4px solid ${CATEGORY_COLORS.alimentacion}`}}>
          <h4 style={{margin: '0 0 8px 0'}}>🍽️ Alimentación</h4>
          <p style={{margin:'0', fontSize:'20px', fontWeight:'bold', color: CATEGORY_COLORS.alimentacion}}>{emissions?.food} kg</p>
        </div>
        <div style={{background: LEVEL_COLORS.muy_alto.light, padding:'16px', borderRadius:'10px', borderLeft:`4px solid ${CATEGORY_COLORS.consumo}`}}>
          <h4 style={{margin: '0 0 8px 0'}}>🛒 Consumo</h4>
          <p style={{margin:'0', fontSize:'20px', fontWeight:'bold', color: CATEGORY_COLORS.consumo}}>{emissions?.consumption} kg</p>
        </div>
      </div>

      <div style={{marginBottom:'24px', background: COLORS.bgLighter, padding: '20px', borderRadius: '10px'}}>
        <h3 style={{marginTop: 0}}>Desglose Porcentual</h3>
        <ul style={{listStyle:'none', padding:'0', margin: 0}}>
          <li style={{padding: '8px 0'}}>🚗 Transporte: <strong style={{color: COLORS.primary}}>{((emissions?.transport/total)*100).toFixed(1)}%</strong></li>
          <li style={{padding: '8px 0'}}>⚡ Energía: <strong style={{color: CATEGORY_COLORS.energia}}>{((emissions?.energy/total)*100).toFixed(1)}%</strong></li>
          <li style={{padding: '8px 0'}}>🍽️ Alimentación: <strong style={{color: CATEGORY_COLORS.alimentacion}}>{((emissions?.food/total)*100).toFixed(1)}%</strong></li>
          <li style={{padding: '8px 0'}}>🛒 Consumo: <strong style={{color: CATEGORY_COLORS.consumo}}>{((emissions?.consumption/total)*100).toFixed(1)}%</strong></li>
        </ul>
      </div>

          {result.tips && (
            <div style={{marginBottom:'28px'}}>
              <h3>💡 Consejos personalizados</h3>
              {Object.keys(result.tips).map(category => (
                <div key={category} style={{marginBottom:'20px'}}>
                  <h4 style={{textTransform:'capitalize', color: COLORS.textPrimary, margin: '0 0 12px 0'}}>{
                    category === 'transporte' ? 'Transporte' :
                    category === 'energia' ? 'Energía' :
                    category === 'alimentacion' ? 'Alimentación' :
                    category === 'consumo' ? 'Consumo' : category
                  }</h4>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
                    {result.tips[category].map((tip, idx) => (
                      <div key={idx} style={{background: 'white', padding: '16px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${CATEGORY_COLORS[category] || COLORS.primary}`}}>
                        <strong style={{color: COLORS.textPrimary}}>{tip.title}</strong>
                        <p style={{margin:'8px 0 0', fontSize: '0.9rem', color: COLORS.textSecondary}}>{tip.description}</p>
                        <small style={{color: COLORS.textSecondary, display: 'block', marginTop: '8px'}}>📉 Reducción: <strong style={{color: COLORS.primary}}>{tip.reduction} kg CO₂/año</strong></small>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

      <div style={{textAlign:'center', marginTop:'28px', paddingTop: '24px', borderTop: `1px solid ${COLORS.border}`}}>
        <a href="/historial" style={{marginRight:'12px', display: 'inline-block', padding: '10px 16px', background: COLORS.bgLighter, borderRadius: '8px', textDecoration: 'none', color: COLORS.primary, fontWeight: 600}}>📋 Ver Historial</a>
        <a href="/consejos" style={{marginRight:'12px', display: 'inline-block', padding: '10px 16px', background: COLORS.bgLighter, borderRadius: '8px', textDecoration: 'none', color: COLORS.primary, fontWeight: 600}}>💡 Ver Consejos</a>
        <a href={'/descargar-pdf/' + id} style={{marginRight:'12px', display: 'inline-block', padding: '10px 16px', background: COLORS.primary, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600}}>📄 Descargar PDF</a>
        <a href="/calcular" style={{display: 'inline-block', padding: '10px 16px', background: COLORS.bgLighter, borderRadius: '8px', textDecoration: 'none', color: COLORS.primary, fontWeight: 600}}>🔄 Nuevo Cálculo</a>
      </div>
    </div>
  )
}
