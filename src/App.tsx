import { useState } from 'react'

import './App.css'
import Cabecalho from './componentes/Cabecalho'
import Chamados from './componentes/Chamados'
import Estoque from './componentes/Estoque'
import Inicio from './componentes/Inicio'
import Nav from './componentes/Nav'
import Orcamentos from './componentes/Orcamentos'
import FornecedoresCompras from './componentes/FornecedoresCompras'
import EquipeEscalas from './componentes/EquipeEscalas'
import TarefasDemandas from './componentes/TarefasDemandas'
import type { Modulo } from './componentes/Nav'

export default function App() {
  const [modulo, setModulo] = useState<Modulo>('inicio')

  return (
    <div className="app-shell">
      <Nav moduloAtual={modulo} navegar={setModulo} />

      <main className="main-content">
        <Cabecalho />

        {modulo === 'inicio' && <Inicio navegar={setModulo} />}
        {modulo === 'chamados' && <Chamados />}
        {modulo === 'orcamentos' && <Orcamentos />}
        {modulo === 'estoque' && <Estoque />}
        {modulo === 'fornecedores' && <FornecedoresCompras />}
        {modulo === 'equipe' && <EquipeEscalas />}
        {modulo === 'tarefas' && <TarefasDemandas />}

        <footer className="app-footer">
          <span>Livraria Cultural</span>
          <span>Plataforma de gestão integrada · 2026</span>
        </footer>
      </main>
    </div>
  )
}
