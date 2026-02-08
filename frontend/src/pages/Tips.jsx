import React, { useState } from 'react'

export default function Tips(){
  const [category, setCategory] = useState('transporte')

  const tips = {
    transporte: [
      { title: 'Usa transporte público', description: 'Reduce emisiones hasta 80%', reduction: 2000 },
      { title: 'Considera vehículo eléctrico', description: 'Significativamente menos emisiones', reduction: 1800 },
      { title: 'Usa bicicleta o camina', description: 'Para distancias cortas (<5km)', reduction: 800 }
    ],
    energia: [
      { title: 'Cambia a energías renovables', description: 'Instala paneles solares', reduction: 2500 },
      { title: 'Reemplaza bombillas con LED', description: 'Consume 75% menos', reduction: 300 },
      { title: 'Desconecta aparatos en standby', description: 'Usa regletas con interruptor', reduction: 200 }
    ],
    alimentacion: [
      { title: 'Reduce consumo de carne roja', description: '10-40x más emisiones que verduras', reduction: 1500 },
      { title: 'Un día sin carne por semana', description: 'Reduce significativamente', reduction: 500 },
      { title: 'Compra productos locales', description: 'Requieren menos transporte', reduction: 300 }
    ]
  }

  const currentTips = tips[category] || []

  return (
    <div className="page">
      <h2>💡 Consejos para Reducir tu Huella</h2>
      
      <div style={{marginBottom:'20px', display:'flex', gap:'10px'}}>
        {Object.keys(tips).map(key=>(
          <button
            key={key}
            onClick={()=>setCategory(key)}
            style={{
              padding:'10px 20px',
              background: category===key ? '#27AE60' : '#eee',
              color: category===key ? 'white' : 'black',
              border:'none',
              borderRadius:'5px',
              cursor:'pointer',
              fontWeight:'bold'
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {currentTips.map((tip, i)=>(
          <div
            key={i}
            style={{
              background:'white',
              padding:'15px',
              marginBottom:'15px',
              borderRadius:'8px',
              borderLeft:'4px solid #27AE60',
              boxShadow:'0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{margin:'0 0 5px 0', color:'#27AE60'}}>{tip.title}</h3>
            <p style={{margin:'5px 0', color:'#666'}}>{tip.description}</p>
            <small style={{color:'#27AE60', fontWeight:'bold'}}>Ahorra: ~{tip.reduction} kg CO₂/año</small>
          </div>
        ))}
      </div>
    </div>
  )
}
