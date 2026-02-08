import React, { useEffect, useState } from 'react'
import { COLORS, LEVEL_COLORS } from '../utils/colors'

export default function History(){
  const [calculations, setCalculations] = useState([])
  const [stats, setStats] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [actionError, setActionError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const computeStats = (items) => {
    if (!items || items.length === 0) return null
    const totals = items.map(c => c.totalEmissions)
    return {
      total: items.length,
      average: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
      lowest: Math.min(...totals),
      highest: Math.max(...totals)
    }
  }

  useEffect(()=>{
    fetch('/api/historial', { credentials: 'include' })
      .then(r=>r.json())
      .then(data=>{
        const items = data.calculations || []
        setCalculations(items)
        setStats(data.stats || computeStats(items))
      })
      .catch(err=>console.error(err))
  },[])

  const startEdit = (calc) => {
    setEditingId(calc._id)
    setEditName(calc.name || '')
    setActionError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setActionError('')
  }

  const saveEdit = async (calcId) => {
    const trimmed = editName.trim()
    if (trimmed.length < 2) {
      setActionError('El nombre debe tener al menos 2 caracteres')
      return
    }
    setSavingId(calcId)
    setActionError('')
    try {
      const res = await fetch(`/api/calculations/${calcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: trimmed })
      })
      const data = await res.json()
      if (!res.ok) {
        setActionError(data.error || 'No se pudo actualizar')
        return
      }
      const updatedList = calculations.map(c => c._id === calcId ? data.calculation : c)
      setCalculations(updatedList)
      setStats(computeStats(updatedList))
      setEditingId(null)
      setEditName('')
    } catch (err) {
      setActionError('Error de conexión: ' + err.message)
    } finally {
      setSavingId(null)
    }
  }

  const deleteCalculation = async (calcId) => {
    const confirmed = window.confirm('¿Eliminar este cálculo? Esta acción no se puede deshacer.')
    if (!confirmed) return
    setDeletingId(calcId)
    setActionError('')
    try {
      const res = await fetch(`/api/calculations/${calcId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) {
        setActionError(data.error || 'No se pudo eliminar')
        return
      }
      const updatedList = calculations.filter(c => c._id !== calcId)
      setCalculations(updatedList)
      setStats(computeStats(updatedList))
    } catch (err) {
      setActionError('Error de conexión: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

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

      {actionError && (
        <div style={{marginBottom:'16px', padding:'12px', background: COLORS.danger, color: 'white', borderRadius: '8px'}}>
          {actionError}
        </div>
      )}

      <div style={{overflowX: 'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse', marginTop: 16}}>
          <thead>
            <tr style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, color: 'white'}}>
              <th style={{padding:'14px', textAlign:'left', fontWeight: 700}}>📅 Fecha</th>
              <th style={{padding:'14px', textAlign:'left', fontWeight: 700}}>📝 Nombre</th>
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
                  <td style={{padding:'14px', color: COLORS.textPrimary, fontWeight: 600}}>
                    {calc.name || 'Sin nombre'}
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
                    <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
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
                      >
                        👁️ Ver
                      </a>

                      {editingId === calc._id ? (
                        <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                          <input
                            value={editName}
                            onChange={(e)=>setEditName(e.target.value)}
                            placeholder="Nombre"
                            style={{padding:'6px 8px', border:`1px solid ${COLORS.border}`, borderRadius:'6px', fontSize:'0.8rem'}}
                          />
                          <button
                            onClick={()=>saveEdit(calc._id)}
                            disabled={savingId === calc._id}
                            style={{background: COLORS.success, color:'white', border:'none', padding:'6px 10px', borderRadius:'6px', fontWeight:600, fontSize:'0.8rem', cursor:'pointer'}}
                          >
                            {savingId === calc._id ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{background: COLORS.bgLighter, color: COLORS.textPrimary, border:`1px solid ${COLORS.border}`, padding:'6px 10px', borderRadius:'6px', fontWeight:600, fontSize:'0.8rem', cursor:'pointer'}}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={()=>startEdit(calc)}
                          style={{background: COLORS.bgLighter, color: COLORS.textPrimary, border:`1px solid ${COLORS.border}`, padding:'8px 12px', borderRadius:'6px', fontWeight:600, fontSize:'0.85rem', cursor:'pointer'}}
                        >
                          ✏️ Editar
                        </button>
                      )}

                      <button
                        onClick={()=>deleteCalculation(calc._id)}
                        disabled={deletingId === calc._id}
                        style={{background: COLORS.danger, color:'white', border:'none', padding:'8px 12px', borderRadius:'6px', fontWeight:600, fontSize:'0.85rem', cursor:'pointer'}}
                      >
                        {deletingId === calc._id ? 'Eliminando...' : '🗑️ Eliminar'}
                      </button>
                    </div>
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
