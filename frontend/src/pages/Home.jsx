import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'
import { COLORS } from '../utils/colors'

export default function Home(){
  const { user } = useContext(AuthContext)

  return (
    <div className="page">
      <section className="card" style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:20,alignItems:'center', padding: '28px', border: `1px solid ${COLORS.border}`}}>
        <div>
          <h1 style={{color: COLORS.primary, margin: '0 0 16px 0'}}>🌍 EcoCalc</h1>
          <p className="muted">Calcula tu huella de carbono, guarda resultados y descarga reportes PDF.</p>
          {user ? (
            <p style={{marginTop:12, color: COLORS.textSecondary}}>Hola, <strong style={{color: COLORS.textPrimary}}>{user.name || user.email}</strong> — continúa con tus cálculos.</p>
          ) : (
            <p style={{marginTop:12, color: COLORS.textSecondary}}>Crea una cuenta o inicia sesión para guardar tus resultados.</p>
          )}

          <div style={{display:'flex',gap:12,marginTop:20, flexWrap: 'wrap'}}>
            <Link to="/calcular" className="btn" style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '8px', fontWeight: 600}}>Comenzar cálculo</Link>
            {user ? <Link to="/historial" className="btn secondary" style={{background: COLORS.bgLighter, color: COLORS.primary, padding: '12px 24px', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, border: `1px solid ${COLORS.border}`}}>Ver historial</Link> : <Link to="/registro" className="btn secondary" style={{background: COLORS.bgLighter, color: COLORS.primary, padding: '12px 24px', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, border: `1px solid ${COLORS.border}`}}>Crear cuenta</Link>}
          </div>
        </div>

        <aside>
        </aside>
      </section>

      <section style={{marginTop:28}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16}}>
          <div className="card" style={{padding: '20px', background: 'white', border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.primary}`}}>
            <h3 style={{margin: '0 0 12px 0', color: COLORS.primary}}>⚡ Rápido</h3>
            <p className="muted tiny" style={{margin: 0}}>Formulario sencillo para estimar tus emisiones en minutos.</p>
          </div>
          <div className="card" style={{padding: '20px', background: 'white', border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.info}`}}>
            <h3 style={{margin: '0 0 12px 0', color: COLORS.info}}>🔒 Seguro</h3>
            <p className="muted tiny" style={{margin: 0}}>Tus resultados son privados y se almacenan con tu sesión.</p>
          </div>
          <div className="card" style={{padding: '20px', background: 'white', border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.warning}`}}>
            <h3 style={{margin: '0 0 12px 0', color: COLORS.warning}}>💡 Acciones</h3>
            <p className="muted tiny" style={{margin: 0}}>Obtén recomendaciones prácticas para reducir tu huella.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
