import '../App.css'
import { BookOpen } from 'lucide-react'

export default function Cabecalho() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo" aria-hidden="true">
          <BookOpen size={24} />
        </div>

        <div className="header-info">
          <h1>Livraria Cultural</h1>
          <p>Plataforma de gestão integrada</p>
        </div>
      </div>

      <div className="header-status">
        <span className="status-dot" />
        <span>Sistema ativo</span>
      </div>
    </header>
  )
}
