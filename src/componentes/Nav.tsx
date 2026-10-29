import {
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users,
  Truck,
  ListChecks,
} from 'lucide-react'

export type Modulo =
  | 'inicio'
  | 'chamados'
  | 'orcamentos'
  | 'estoque'
  | 'fornecedores'
  | 'equipe'
  | 'tarefas'

type NavProps = {
  moduloAtual: Modulo
  navegar: (destino: Modulo) => void
}

export default function Nav({ moduloAtual, navegar }: NavProps) {
  return (
    <aside className="sidebar">
      <div className="nav-section">
        <span className="nav-label">MENU PRINCIPAL</span>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${moduloAtual === 'inicio' ? 'active' : ''}`}
            onClick={() => navegar('inicio')}
          >
            <LayoutDashboard size={19} />
            <span>Visão geral</span>
          </button>

          <button
            className={`nav-item ${moduloAtual === 'chamados' ? 'active' : ''}`}
            onClick={() => navegar('chamados')}
          >
            <ClipboardList size={19} />
            <span>Chamados</span>
          </button>

          <button
            className={`nav-item ${moduloAtual === 'orcamentos' ? 'active' : ''}`}
            onClick={() => navegar('orcamentos')}
          >
            <FileText size={19} />
            <span>Orçamentos</span>
          </button>

          <button
            className={`nav-item ${moduloAtual === 'estoque' ? 'active' : ''}`}
            onClick={() => navegar('estoque')}
          >
            <Boxes size={19} />
            <span>Estoque e insumos</span>
          </button>

          <button className={`nav-item ${moduloAtual === 'fornecedores' ? 'active' : ''}`} onClick={() => navegar('fornecedores')}>
            <Truck size={19} /><span>Fornecedores</span>
          </button>
          <button className={`nav-item ${moduloAtual === 'equipe' ? 'active' : ''}`} onClick={() => navegar('equipe')}>
            <Users size={19} /><span>Equipe e escalas</span>
          </button>
          <button className={`nav-item ${moduloAtual === 'tarefas' ? 'active' : ''}`} onClick={() => navegar('tarefas')}>
            <ListChecks size={19} /><span>Tarefas</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot" />
          <span>Sistema operacional</span>
        </div>

        <small>React + Vite + TypeScript</small>
      </div>
    </aside>
  )
}
