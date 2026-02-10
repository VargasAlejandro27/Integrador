import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'
import { COLORS } from '../utils/colors'

export default function Home(){
  const { user } = useContext(AuthContext)

  return (
    <div className="page home-grid">
      <section className="hero">
        <div className="hero-copy">
          <div className="pill">Huella de carbono</div>
          <h1>Planea, mide y ejecuta tu estrategia net-zero con total claridad.</h1>
          <p className="muted">Benchmarks globales, métricas precisas y recomendaciones accionables inspiradas en experiencias de marcas líderes. Interfaz limpia, decisiones rápidas.</p>

          <div className="cta-row">
            <Link to="/calcular" className="btn">Comenzar ahora</Link>
            {user ? (
              <Link to="/historial" className="ghost">Ver historial</Link>
            ) : (
              <Link to="/registro" className="ghost">Crear cuenta</Link>
            )}
          </div>
          <div className="meta-grid">
            <div>
              <p className="label">Precisión</p>
              <strong>±2.5%</strong>
              <small>Modelos auditables</small>
            </div>
            <div>
              <p className="label">Reportes</p>
              <strong>PDF instantáneo</strong>
              <small>Listo para comité</small>
            </div>
            <div>
              <p className="label">Integridad</p>
              <strong>Cifrado + sesión</strong>
              <small>Control total de datos</small>
            </div>
          </div>

          <ul className="hero-list">
            <li>Onboarding en minutos con formulario compacto.</li>
            <li>Historial y resultados listos para compartir.</li>
            <li>Consejos priorizados por impacto y esfuerzo.</li>
          </ul>
        </div>

      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <span className="chip">Velocidad</span>
          <h3>Formulario express</h3>
          <p>Completa tu evaluación en menos de 3 minutos con entradas simplificadas.</p>
        </div>
        <div className="feature-card">
          <span className="chip alt">Seguridad</span>
          <h3>Autenticación sólida</h3>
          <p>Sesiones protegidas y datos listos para auditoría con trazabilidad.</p>
        </div>
        <div className="feature-card">
          <span className="chip warm">Acción</span>
          <h3>Consejos accionables</h3>
          <p>Recomendaciones personalizadas priorizadas por impacto y esfuerzo.</p>
        </div>
      </section>
    </div>
  )
}
