import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  ClipboardList,
  FileText,
  ListChecks,
  Truck,
  Users,
} from 'lucide-react'
import type { Modulo } from './Nav'

type InicioProps = {
  navegar: (destino: Modulo) => void
}

export default function Inicio({ navegar }: InicioProps) {
  return (
    <section className="dashboard">
      <div className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-tag">PLATAFORMA INTEGRADA</span>
          <h2>Gestão simples, tudo em um só lugar.</h2>
          <p>
            Organize solicitações, crie orçamentos e controle o estoque da
            sua livraria em uma única plataforma.
          </p>

          <button
            className="welcome-button"
            onClick={() => navegar('chamados')}
          >
            Acessar sistema
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="welcome-decoration">
          <div className="decoration-circle circle-one" />
          <div className="decoration-circle circle-two" />
          <div className="decoration-icon">
            <BookOpen size={66} strokeWidth={1.3} />
          </div>
        </div>
      </div>

      <div className="section-title">
        <div>
          <span className="eyebrow">SUA PLATAFORMA</span>
          <h2>Módulos integrados</h2>
          <p>Escolha um módulo para começar a trabalhar.</p>
        </div>
      </div>

      <div className="module-grid">
        <button
          className="module-card"
          onClick={() => navegar('chamados')}
        >
          <div className="module-card-top">
            <div className="module-icon icon-green">
              <ClipboardList size={23} />
            </div>
            <span className="module-index">01</span>
          </div>
          <span className="module-label">ATENDIMENTO</span>
          <h3>Central de Chamados e Solicitações</h3>
          <p>
            Abra chamados internos ou de clientes, defina prioridades,
            registre acompanhamentos e encerre solicitações.
          </p>
          <div className="module-card-footer">
            <span>Acessar módulo</span>
            <ArrowUpRight size={17} />
          </div>
        </button>

        <button
          className="module-card"
          onClick={() => navegar('orcamentos')}
        >
          <div className="module-card-top">
            <div className="module-icon icon-blue">
              <FileText size={23} />
            </div>
            <span className="module-index">02</span>
          </div>
          <span className="module-label">COMERCIAL</span>
          <h3>Emissor de Orçamentos e Propostas</h3>
          <p>
            Monte propostas com produtos e serviços, calcule subtotais
            automaticamente e acompanhe a situação de cada orçamento.
          </p>
          <div className="module-card-footer">
            <span>Acessar módulo</span>
            <ArrowUpRight size={17} />
          </div>
        </button>

        <button
          className="module-card"
          onClick={() => navegar('estoque')}
        >
          <div className="module-card-top">
            <div className="module-icon icon-orange">
              <Boxes size={23} />
            </div>
            <span className="module-index">03</span>
          </div>
          <span className="module-label">INVENTÁRIO</span>
          <h3>Controle de Estoque e Insumos</h3>
          <p>
            Cadastre produtos, controle entradas e saídas, filtre por
            categoria e receba alertas de estoque mínimo.
          </p>
          <div className="module-card-footer">
            <span>Acessar módulo</span>
            <ArrowUpRight size={17} />
          </div>
        </button>

        <button className="module-card" onClick={() => navegar('fornecedores')}>
          <div className="module-card-top">
            <div className="module-icon icon-orange"><Truck size={23} /></div>
            <span className="module-index">04</span>
          </div>
          <span className="module-label">COMPRAS</span>
          <h3>Gestão de Fornecedores e Compras</h3>
          <p>Cadastre fornecedores, compare cotações e controle pedidos de reposição.</p>
          <div className="module-card-footer"><span>Acessar módulo</span><ArrowUpRight size={17} /></div>
        </button>

        <button className="module-card" onClick={() => navegar('equipe')}>
          <div className="module-card-top">
            <div className="module-icon icon-blue"><Users size={23} /></div>
            <span className="module-index">05</span>
          </div>
          <span className="module-label">PESSOAS</span>
          <h3>Gerenciamento de Equipe e Escalas</h3>
          <p>Aloque colaboradores por turno, atividade e disponibilidade.</p>
          <div className="module-card-footer"><span>Acessar módulo</span><ArrowUpRight size={17} /></div>
        </button>

        <button className="module-card" onClick={() => navegar('tarefas')}>
          <div className="module-card-top">
            <div className="module-icon icon-green"><ListChecks size={23} /></div>
            <span className="module-index">06</span>
          </div>
          <span className="module-label">OPERAÇÕES</span>
          <h3>Controle de Tarefas e Demandas</h3>
          <p>Organize atividades por status, prioridade e responsável.</p>
          <div className="module-card-footer"><span>Acessar módulo</span><ArrowUpRight size={17} /></div>
        </button>
      </div>

      <div className="features-panel">
        <div className="features-heading">
          <div className="features-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <h3>Uma plataforma feita para facilitar</h3>
            <p>Organização, usabilidade e praticidade para o dia a dia.</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <CheckCircle2 size={17} />
            <span>Navegação integrada</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={17} />
            <span>Interface responsiva</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={17} />
            <span>Dados salvos no navegador</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={17} />
            <span>Identidade visual consistente</span>
          </div>
        </div>
      </div>
    </section>
  )
}
