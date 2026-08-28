import { BarChart3, LayoutDashboard, Menu, Tag } from 'lucide-react'

export function Home({ page, menuOpen, onToggleMenu, onNavigate, children }) {
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? '' : 'collapsed'}`}>
        <div className="brand">
          <div className="brand-mark"><Tag size={20} /></div>
          {menuOpen && <div><strong>Mercado Norte</strong><small>Operaciones</small></div>}
        </div>
        <nav>
          <button className={page === 'promotions' ? 'active' : ''} onClick={() => onNavigate('promotions')}>
            <LayoutDashboard size={18} />{menuOpen && 'Gestión de promociones'}
          </button>
          <button className={page === 'summary' ? 'active' : ''} onClick={() => onNavigate('summary')}>
            <BarChart3 size={18} />{menuOpen && 'Vista de resumen'}
          </button>
        </nav>
        <div className="sidebar-foot">
          {menuOpen && <><span className="status-dot" /> API conectada</>}
          <button className="icon-button" aria-label="Contraer menú" onClick={onToggleMenu}><Menu size={19} /></button>
        </div>
      </aside>
      {children}
    </div>
  )
}