import React, { useEffect, useState } from 'react'
import { COLORS, LEVEL_COLORS } from '../utils/colors'

export default function History(){
  const [calculations, setCalculations] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(()=>{
    fetch('/api/historial')
      .then(r=>r.json())
      .then(data=>{
        setCalculations(data.calculations || [])
        setStats(data.stats)
      })
      .catch(err=>console.error(err))
  },[])

  return (
    <div className="page">
      <h2 style={{color: COLORS.primary, marginBottom: 24}}>📋 Mi Historial de Cálculos</h2>
      
      {stats && (
        <div style={{marginBottom:'24px', padding:'20px', background: COLORS.successLight, border: `2px solid ${COLORS.primary}`, borderRadius:'12px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16}}>
            <div>
              <p style={{margin: '0 0 8px 0', color: COLORS.textSecondary, fontSize: '0.85rem', fontWeight: 600}}>Total de cálculos</p>
              <p style={{margin: 0, fontSize: '24px', fontWeight: 800, color: COLORS.primary}}>{stats.total}</p>
            </div>
            <div>
              <p style={{margin: '0 0 8px 0', color: COLORS.textSecondary, fontSize: '0.85rem', fontWeight: 600}}>Promedio</p>
              <p style={{margin: 0, fontSize: '24px', fontWeight: 800, color: COLORS.primary}}>{stats.average}</p>
              <p style={{margin: '4px 0 0 0', color: COLORS.textSecondary, fontSize: '0.8rem'}}>kg CO₂/año</p>
            </div>
            <div>
              <p style={{margin: '0 0 8px 0', color: COLORS.textSecondary, fontSize: '0.85rem', fontWeight: 600}}>Rango</p>
              <p style={{margin: 0, fontSize: '0.95rem', fontWeight: 600}}>
                <span style={{color: COLORS.primary}}>{stats.lowest}</span> - <span style={{color: COLORS.warning}}>{stats.highest}</span>
              </p>
              <p style={{margin: '4px 0 0 0', color: COLORS.textSecondary, fontSize: '0.8rem'}}>kg CO₂/año</p>
            </div>
          </div>
        </div>
      )}

      <div style={{overflowX: 'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse', marginTop: 16}}>
          <thead>
            <tr style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, color: 'white'}}>
              <th style={{padding:'14px', textAlign:'left', fontWeight: 700}}>📅 Fecha</th>
              <th style={{padding:'14px', textAlign:'left', fontWeight: 700}}>🔥 Emisiones</th>
              <th style={{padding:'14px', textAlign:'left', fontWeight: 700}}>📊 Nivel</th>
              <th style={{padding:'14px', textAlign:'left', fontWeight: 700}}>⚙️ Acción</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc, i)=>{
              const levelData = LEVEL_COLORS[calc.level] || LEVEL_COLORS.promedio;
              return (
                <tr key={i} style={{borderBottom: `1px solid ${COLORS.border}`}}>
                  <td style={{padding:'14px', color: COLORS.textPrimary, fontWeight: 500}}>
                    {new Date(calc.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td style={{padding:'14px', fontWeight: 600, fontSize: '0.95rem'}}>
                    <span style={{color: COLORS.primary}}>{calc.totalEmissions}</span> kg CO₂
                  </td>
                  <td style={{padding:'14px'}}>
                    <span style={{
                      background: levelData.bg,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-block',
                      textTransform: 'capitalize'
                    }}>
                      {calc.level}
                    </span>
                  </td>
                  <td style={{padding:'14px'}}>
                    <a 
                      href={`/resultados/${calc._id}`} 
                      style={{
                        background: COLORS.primary,
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        display: 'inline-block',
                        transition: 'all 0.25s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      👁️ Ver detalles
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {calculations.length === 0 && (
        <div style={{textAlign: 'center', padding: '32px', color: COLORS.textSecondary}}>
          <p style={{fontSize: '1.1rem', fontWeight: 600}}>No hay cálculos aún</p>
          <p style={{marginTop: 8}}>Realiza tu primer cálculo de huella de carbono para ver el historial aquí.</p>
          <a href="/calcular" style={{marginTop: 16, display: 'inline-block', background: COLORS.primary, color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600}}>
            Comenzar cálculo
          </a>
        </div>
      )}
    </div>
  )
}
