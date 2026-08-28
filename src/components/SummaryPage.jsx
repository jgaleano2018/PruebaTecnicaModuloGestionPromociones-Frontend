import { useEffect, useState } from 'react'
import { BarChart3, ChevronRight, Package, Percent, RefreshCw, Tag } from 'lucide-react'
import { demoPromotions } from '../services/api'
import { promocionService } from '../infrastructure/services'

const initialCounts = { programada: 0, activa: 0, finalizada: 0, total: 0 }
const initialDates = { from: '2026-08-01', to: '2026-08-31' }

async function readResponse(response) {
  return typeof response?.json === 'function' ? response.json() : response
}

export function SummaryPage({ onExit, notify }) {
  const [counts, setCounts] = useState(initialCounts)
  const [current, setCurrent] = useState({ totalVigentes: 0, promociones: [] })
  const [dates, setDates] = useState(initialDates)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCounts = () => promocionService.countStates().subscribe({
    next: async (response) => setCounts((await readResponse(response)) || initialCounts),
    error: () => setError('No fue posible cargar el contador por estado.'),
  })

  const loadCurrent = (from = dates.from, to = dates.to) => {
    setLoading(true)
    return promocionService.current(from, to).subscribe({
      next: async (response) => { setCurrent((await readResponse(response)) || { totalVigentes: 0, promociones: [] }); setLoading(false) },
      error: () => { setError('No fue posible cargar las promociones vigentes.'); setLoading(false) },
    })
  }

  useEffect(() => {
    setError('')
    const countSubscription = loadCounts()
    const currentSubscription = loadCurrent()
    return () => { countSubscription.unsubscribe(); currentSubscription.unsubscribe() }
  }, [])

  const applyFilters = (event) => {
    event.preventDefault()
    if (!dates.from || !dates.to || dates.from > dates.to) { setError('El rango de fechas no es válido.'); return }
    setError('')
    loadCurrent(dates.from, dates.to)
    notify?.('Consulta de vigencia actualizada')
  }

  return <section className="page-body"><div className="section-heading"><div><p className="section-kicker">LECTURA EJECUTIVA</p><h2>Vista de resumen</h2><p className="muted">Consulta el comportamiento de tus promociones por estado y vigencia.</p></div><button className="button secondary" onClick={onExit}><ChevronRight size={16} />Salir</button></div>{error && <div className="error-banner" role="alert">{error}</div>}<div className="summary-grid"><div className="summary-panel"><div className="panel-title"><div><span className="section-kicker">CONTADOR SIMPLE POR ESTADO</span><h3>Distribución de promociones</h3></div><BarChart3 size={20} /></div><div className="count-grid"><Count label="Programadas" value={counts.programada} tone="orange" /><Count label="Activas" value={counts.activa} tone="green" /><Count label="Finalizadas" value={counts.finalizada} tone="gray" /><Count label="Total" value={counts.total} tone="blue" /></div></div><div className="summary-panel accent-panel"><div className="panel-title"><div><span className="section-kicker">PROMOCIONES VIGENTES</span><h3>Total en rango</h3></div><Percent size={20} /></div><strong className="big-number">{current.totalVigentes ?? current.promociones?.length ?? 0}</strong><p className="muted">promociones encontradas</p></div></div><div className="table-card"><div className="table-head"><div><span className="section-kicker">CONSULTA DE VIGENCIA</span><h3>Promociones vigentes</h3></div><span className="table-label"><Package size={14} />GET /resumen/vigentes</span></div><form className="filters" onSubmit={applyFilters}><label className="field"><span>Fecha inicio</span><input type="date" value={dates.from} onChange={(event) => setDates({ ...dates, from: event.target.value })} required /></label><label className="field"><span>Fecha fin</span><input type="date" value={dates.to} onChange={(event) => setDates({ ...dates, to: event.target.value })} required /></label><button className="button primary filter-button" type="submit" disabled={loading}><RefreshCw size={16} />{loading ? 'Consultando...' : 'Consultar'}</button></form><div className="current-list">{current.promociones?.length ? current.promociones.map((promotion) => <div className="current-row" key={promotion.id}><div className="current-icon"><Tag size={17} /></div><div><strong>{promotion.nombre}</strong><span>{promotion.descripcion || 'Promoción comercial'}</span></div><span className={`badge ${(promotion.estadoPromocionNombre || '').toLowerCase()}`}>{promotion.estadoPromocionNombre}</span><strong className="current-value">{promotion.tipoDescuentoNombre === 'Porcentaje' ? `${promotion.valorDescuento}%` : promotion.tipoDescuentoNombre}</strong></div>) : <div className="empty">{loading ? 'Cargando promociones...' : 'No hay promociones vigentes en este rango.'}</div>}</div></div></section>
}

function Count({ label, value, tone }) { return <div className="count"><span className={`count-dot ${tone}`} /><span>{label}</span><strong>{value ?? 0}</strong></div> }

export { demoPromotions }
