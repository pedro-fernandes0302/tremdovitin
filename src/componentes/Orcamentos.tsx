
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Plus,
  FileText,
  Search,
  X,
  Trash2,
  Send,
  CircleDollarSign,
} from 'lucide-react'

import type {
  ItemOrcamento,
  Orcamento,
  Situacao,
} from '../types'

import '../orcamentos.css'

const KEY = 'livraria-orcamentos-v1'

const brl = (n: number) =>
  n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

export default function Orcamentos() {
  const [lista, setLista] = useState<Orcamento[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)
  const [cliente, setCliente] = useState('')
  const [descricao, setDescricao] = useState('')

  const [itens, setItens] = useState<ItemOrcamento[]>([
    {
      id: crypto.randomUUID(),
      nome: '',
      quantidade: 1,
      valorUnitario: 0,
    },
  ])

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lista))
  }, [lista])

  const filtrados = useMemo(
    () =>
      lista.filter((o) =>
        `${o.cliente} ${o.id} ${o.descricao}`
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [lista, busca],
  )

  const total = (o: Orcamento) =>
    o.itens.reduce(
      (soma, item) =>
        soma + item.quantidade * item.valorUnitario,
      0,
    )

  const totalAtual = itens.reduce(
    (soma, item) =>
      soma + item.quantidade * item.valorUnitario,
    0,
  )

  const editarItem = (
    id: string,
    dados: Partial<ItemOrcamento>,
  ) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...dados } : item,
      ),
    )
  }

  function remover(orcamento: Orcamento) {
    if (!window.confirm(`Excluir a proposta ${orcamento.id}?`)) return
    setLista((prev) => prev.filter((item) => item.id !== orcamento.id))
  }

  function criar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const validos = itens.filter(
      (item) => item.nome.trim() && item.quantidade > 0,
    )

    if (!validos.length) return

    const orcamento: Orcamento = {
      id: `OR-${String(Date.now()).slice(-6)}`,
      cliente: cliente.trim(),
      descricao: descricao.trim(),
      situacao: 'Rascunho',
      data: new Date().toLocaleDateString('pt-BR'),
      itens: validos,
    }

    setLista((prev) => [orcamento, ...prev])
    setModal(false)
    setCliente('')
    setDescricao('')

    setItens([
      {
        id: crypto.randomUUID(),
        nome: '',
        quantidade: 1,
        valorUnitario: 0,
      },
    ])
  }

  return (
    <section className="module-page">
      <div className="page-intro quotes-page-intro">
        <div className="quotes-title">
          <span className="quotes-kicker">COMERCIAL E PROPOSTAS</span>
          <div>
            <h2>Orçamentos e Propostas</h2>
            <p className="muted">
              Monte propostas e calcule os valores automaticamente.
            </p>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={() => setModal(true)}
        >
          <Plus size={18} /> Novo orçamento
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Propostas criadas</span>
          <strong>{lista.length}</strong>
          <FileText />
        </div>

        <div className="stat-card">
          <span>Enviadas</span>
          <strong>
            {lista.filter((o) => o.situacao === 'Enviado').length}
          </strong>
          <Send />
        </div>

        <div className="stat-card">
          <span>Aprovadas</span>
          <strong>
            {lista.filter((o) => o.situacao === 'Aprovado').length}
          </strong>
          <CircleDollarSign />
        </div>

        <div className="stat-card">
          <span>Valor aprovado</span>
          <strong className="money-stat">
            {brl(
              lista
                .filter((o) => o.situacao === 'Aprovado')
                .reduce((soma, o) => soma + total(o), 0),
            )}
          </strong>
          <CircleDollarSign />
        </div>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h3>Propostas registradas</h3>
            <p className="muted">
              Altere a situação de cada orçamento.
            </p>
          </div>

          <label className="search-box">
            <Search size={17} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar cliente ou proposta..."
            />
          </label>
        </div>

        {filtrados.length === 0 ? (
          <div className="empty-state">
            <FileText size={36} />
            <strong>Nenhum orçamento cadastrado</strong>
            <p>Crie uma proposta para começar.</p>
            <button
              className="secondary-btn"
              onClick={() => setModal(true)}
            >
              Criar orçamento
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Proposta</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Situação</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.id}</strong>
                      <small>{o.descricao || 'Sem descrição'}</small>
                    </td>
                    <td>{o.cliente}</td>
                    <td>{o.itens.length}</td>
                    <td><strong>{brl(total(o))}</strong></td>
                    <td>
                      <select
                        className={`quote-status quote-${o.situacao.toLowerCase()}`}
                        value={o.situacao}
                        onChange={(e) =>
                          setLista((prev) =>
                            prev.map((x) =>
                              x.id === o.id
                                ? {
                                    ...x,
                                    situacao: e.target.value as Situacao,
                                  }
                                : x,
                            ),
                          )
                        }
                      >
                        <option>Rascunho</option>
                        <option>Enviado</option>
                        <option>Aprovado</option>
                        <option>Recusado</option>
                      </select>
                    </td>
                    <td>{o.data}</td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        aria-label={`Excluir proposta ${o.id}`}
                        title="Excluir proposta"
                        onClick={() => remover(o)}
                      >
                        <Trash2 size={16} />
                      </button>
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
            className="modal-card quote-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Montar orçamento</h3>
                <p className="muted">
                  Informe cliente, itens e valores.
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setModal(false)}
                type="button"
              >
                <X />
              </button>
            </div>

            <form onSubmit={criar}>
              <div className="quote-form-top">
                <label>
                  Cliente
                  <input
                    required
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nome ou empresa"
                  />
                </label>

                <label>
                  Descrição
                  <input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex.: Materiais para evento"
                  />
                </label>
              </div>

              <div className="items-heading">
                <h4>Itens e serviços</h4>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() =>
                    setItens((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        nome: '',
                        quantidade: 1,
                        valorUnitario: 0,
                      },
                    ])
                  }
                >
                  <Plus size={15} /> Adicionar item
                </button>
              </div>

              <div className="quote-items">
                {itens.map((item, index) => (
                  <div className="quote-item-row" key={item.id}>
                    <label className="item-name">
                      Item {index + 1}
                      <input
                        required
                        value={item.nome}
                        onChange={(e) =>
                          editarItem(item.id, { nome: e.target.value })
                        }
                        placeholder="Nome do item"
                      />
                    </label>

                    <label>
                      Qtd.
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) =>
                          editarItem(item.id, {
                            quantidade: Math.max(
                              1,
                              Number(e.target.value),
                            ),
                          })
                        }
                      />
                    </label>

                    <label>
                      Valor unitário
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.valorUnitario}
                        onChange={(e) =>
                          editarItem(item.id, {
                            valorUnitario: Math.max(
                              0,
                              Number(e.target.value),
                            ),
                          })
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="remove-item"
                      disabled={itens.length === 1}
                      onClick={() =>
                        setItens((prev) =>
                          prev.filter((x) => x.id !== item.id),
                        )
                      }
                      aria-label="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="quote-total">
                <span>Subtotal / Total</span>
                <strong>{brl(totalAtual)}</strong>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-btn quote-save-btn">
                  Salvar proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
