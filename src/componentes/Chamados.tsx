
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Plus,
  Search,
  ClipboardList,
  Clock3,
  CheckCircle2,
  X,
  MessageSquare,
  ArrowRight,
  Trash2,
} from 'lucide-react'

import type {
  Chamado,
  Prioridade,
  StatusChamado,
  OrigemChamado,
} from '../types'

import '../chamados.css'

const KEY = 'livraria-chamados-v1'

const agora = () =>
  new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

const iniciais = (nome: string) =>
  nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

export default function Chamados() {
  const [lista, setLista] = useState<Chamado[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [atualId, setAtualId] = useState<string | null>(null)
  const [acomp, setAcomp] = useState('')

  const [form, setForm] = useState({
    titulo: '',
    solicitante: '',
    origem: 'Interno' as OrigemChamado,
    prioridade: 'Média' as Prioridade,
    descricao: '',
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lista))
  }, [lista])

  const filtrados = useMemo(
    () =>
      lista.filter(
        (c) =>
          `${c.titulo} ${c.solicitante} ${c.id}`
            .toLowerCase()
            .includes(busca.toLowerCase()) &&
          (filtro === 'Todos' || c.status === filtro),
      ),
    [lista, busca, filtro],
  )

  const atual = lista.find((c) => c.id === atualId)

  const mudar = (id: string, dados: Partial<Chamado>) => {
    setLista((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...dados } : c)),
    )
  }

  function remover(chamado: Chamado) {
    if (!window.confirm(`Excluir o chamado "${chamado.titulo}"?`)) return
    setLista((prev) => prev.filter((item) => item.id !== chamado.id))
    if (atualId === chamado.id) setAtualId(null)
  }

  function criar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const chamado: Chamado = {
      ...form,
      id: `CH-${String(Date.now()).slice(-6)}`,
      status: 'Aberto',
      criadoEm: agora(),
      acompanhamentos: [],
    }

    setLista((prev) => [chamado, ...prev])
    setAtualId(chamado.id)
    setModal(false)

    setForm({
      titulo: '',
      solicitante: '',
      origem: 'Interno',
      prioridade: 'Média',
      descricao: '',
    })
  }

  function registrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!atual || !acomp.trim()) return

    mudar(atual.id, {
      acompanhamentos: [
        ...atual.acompanhamentos,
        {
          id: crypto.randomUUID(),
          texto: acomp.trim(),
          data: agora(),
        },
      ],
    })

    setAcomp('')
  }

  return (
    <section className="module-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">ATENDIMENTO E SUPORTE</p>
          <h2>Central de Chamados</h2>
          <p className="muted">
            Abra solicitações, acompanhe atualizações e encerre chamados
            resolvidos.
          </p>
        </div>

        <button className="primary-btn" onClick={() => setModal(true)}>
          <Plus size={18} /> Novo chamado
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total de chamados</span>
          <strong>{lista.length}</strong>
          <ClipboardList />
        </div>

        <div className="stat-card">
          <span>Em aberto</span>
          <strong>{lista.filter((c) => c.status === 'Aberto').length}</strong>
          <Clock3 />
        </div>

        <div className="stat-card">
          <span>Em andamento</span>
          <strong>
            {lista.filter((c) => c.status === 'Em andamento').length}
          </strong>
          <MessageSquare />
        </div>

        <div className="stat-card">
          <span>Encerrados</span>
          <strong>
            {lista.filter((c) => c.status === 'Encerrado').length}
          </strong>
          <CheckCircle2 />
        </div>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h3>Solicitações registradas</h3>
            <p className="muted">
              Consulte e gerencie todos os chamados.
            </p>
          </div>

          <div className="filters">
            <label className="search-box">
              <Search size={17} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar chamado..."
              />
            </label>

            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option>Todos</option>
              <option>Aberto</option>
              <option>Em andamento</option>
              <option>Encerrado</option>
            </select>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={36} />
            <strong>Nenhum chamado encontrado</strong>
            <p>Crie um chamado para começar.</p>
            <button
              className="secondary-btn"
              onClick={() => setModal(true)}
            >
              Criar chamado
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Chamado</th>
                  <th>Solicitante</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    className="click-row"
                    onClick={() => setAtualId(c.id)}
                  >
                    <td>
                      <strong>{c.titulo}</strong>
                      <small>{c.id} · {c.origem}</small>
                    </td>

                    <td>
                      <span className="person">
                        <span className="person-avatar">
                          {iniciais(c.solicitante)}
                        </span>
                        {c.solicitante}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`priority priority-${c.prioridade.toLowerCase()}`}
                      >
                        {c.prioridade}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status status-${c.status
                          .toLowerCase()
                          .replace(' ', '-')}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td>{c.criadoEm}</td>
                    <td>
                      <div className="row-actions">
                        <ArrowRight size={16} />
                        <button
                          type="button"
                          className="icon-btn delete-btn"
                          aria-label={`Excluir chamado ${c.id}`}
                          title="Excluir chamado"
                          onClick={(event) => {
                            event.stopPropagation()
                            remover(c)
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div
          className="modal-backdrop"
          onClick={() => setModal(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Abrir novo chamado</h3>
                <p className="muted">Preencha os dados da solicitação.</p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setModal(false)}
                type="button"
              >
                <X />
              </button>
            </div>

            <form className="form-grid" onSubmit={criar}>
              <label className="full-field">
                Título
                <input
                  required
                  value={form.titulo}
                  onChange={(e) =>
                    setForm({ ...form, titulo: e.target.value })
                  }
                  placeholder="Ex.: Problema no computador"
                />
              </label>

              <label>
                Solicitante
                <input
                  required
                  value={form.solicitante}
                  onChange={(e) =>
                    setForm({ ...form, solicitante: e.target.value })
                  }
                  placeholder="Nome completo"
                />
              </label>

              <label>
                Origem
                <select
                  value={form.origem}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      origem: e.target.value as OrigemChamado,
                    })
                  }
                >
                  <option>Interno</option>
                  <option>Cliente</option>
                </select>
              </label>

              <label>
                Prioridade
                <select
                  value={form.prioridade}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      prioridade: e.target.value as Prioridade,
                    })
                  }
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>
              </label>

              <label className="full-field">
                Descrição
                <textarea
                  required
                  rows={4}
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  placeholder="Descreva a solicitação..."
                />
              </label>

              <div className="form-actions full-field">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>
                <button className="primary-btn">Criar chamado</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {atual && (
        <div
          className="modal-backdrop"
          onClick={() => setAtualId(null)}
        >
          <div
            className="modal-card detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="ticket-id">{atual.id}</span>
                <h3>{atual.titulo}</h3>
                <p className="muted">
                  Aberto por {atual.solicitante} · {atual.criadoEm}
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setAtualId(null)}
                type="button"
              >
                <X />
              </button>
            </div>

            <div className="detail-badges">
              <span
                className={`priority priority-${atual.prioridade.toLowerCase()}`}
              >
                {atual.prioridade}
              </span>
              <span
                className={`status status-${atual.status
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {atual.status}
              </span>
              <span className="origin-badge">{atual.origem}</span>
            </div>

            <div className="description-box">
              <strong>Descrição</strong>
              <p>{atual.descricao}</p>
            </div>

            <label className="status-control">
              Situação
              <select
                value={atual.status}
                onChange={(e) =>
                  mudar(atual.id, {
                    status: e.target.value as StatusChamado,
                  })
                }
              >
                <option>Aberto</option>
                <option>Em andamento</option>
                <option>Encerrado</option>
              </select>
            </label>

            <div className="history">
              <h4>
                Acompanhamento ({atual.acompanhamentos.length})
              </h4>

              {atual.acompanhamentos.length === 0 ? (
                <p className="muted">
                  Nenhuma atualização registrada.
                </p>
              ) : (
                atual.acompanhamentos.map((a) => (
                  <div className="history-item" key={a.id}>
                    <span className="history-dot" />
                    <div>
                      <p>{a.texto}</p>
                      <small>{a.data}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {atual.status !== 'Encerrado' && (
              <form className="followup-form" onSubmit={registrar}>
                <label>
                  Nova atualização
                  <textarea
                    required
                    rows={2}
                    value={acomp}
                    onChange={(e) => setAcomp(e.target.value)}
                    placeholder="Registre o andamento..."
                  />
                </label>

                <button className="primary-btn">
                  Registrar acompanhamento
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
