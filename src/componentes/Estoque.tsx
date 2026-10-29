
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Plus,
  Boxes,
  AlertTriangle,
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  X,
  History,
  Trash2,
} from 'lucide-react'

import type {
  Categoria,
  Movimentacao,
  Produto,
} from '../types'

import '../estoque.css'

const KEY = 'livraria-estoque-v1'
const MOV = 'livraria-movimentacoes-v1'

const brl = (n: number) =>
  n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const agora = () =>
  new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

export default function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  const [movs, setMovs] = useState<Movimentacao[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(MOV) || '[]')
    } catch {
      return []
    }
  })

  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [novo, setNovo] = useState(false)
  const [movProduto, setMovProduto] = useState<Produto | null>(null)
  const [tipo, setTipo] = useState<'Entrada' | 'Saída'>('Entrada')
  const [qtd, setQtd] = useState(1)

  const [form, setForm] = useState({
    nome: '',
    categoria: 'Livros' as Categoria,
    quantidade: 0,
    minimo: 3,
    custo: 0,
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(produtos))
  }, [produtos])

  useEffect(() => {
    localStorage.setItem(MOV, JSON.stringify(movs))
  }, [movs])

  const baixo = produtos.filter(
    (p) => p.quantidade <= p.minimo,
  )

  const valor = produtos.reduce(
    (soma, p) => soma + p.quantidade * p.custo,
    0,
  )

  const filtrados = useMemo(
    () =>
      produtos.filter(
        (p) =>
          `${p.nome} ${p.id}`
            .toLowerCase()
            .includes(busca.toLowerCase()) &&
          (categoria === 'Todas' || p.categoria === categoria),
      ),
    [produtos, busca, categoria],
  )

  function cadastrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const produto: Produto = {
      ...form,
      nome: form.nome.trim(),
      id: `PR-${String(Date.now()).slice(-6)}`,
      data: agora(),
    }

    setProdutos((prev) => [produto, ...prev])
    setNovo(false)

    setForm({
      nome: '',
      categoria: 'Livros',
      quantidade: 0,
      minimo: 3,
      custo: 0,
    })
  }

  function remover(produto: Produto) {
    if (!window.confirm(`Excluir "${produto.nome}" do estoque? O histórico de movimentações será mantido.`)) return
    setProdutos((prev) => prev.filter((item) => item.id !== produto.id))
    if (movProduto?.id === produto.id) setMovProduto(null)
  }

  function movimentar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!movProduto) return

    if (tipo === 'Saída' && qtd > movProduto.quantidade) {
      alert('A saída não pode ultrapassar o estoque atual.')
      return
    }

    setProdutos((prev) =>
      prev.map((p) =>
        p.id === movProduto.id
          ? {
              ...p,
              quantidade:
                p.quantidade + (tipo === 'Entrada' ? qtd : -qtd),
              data: agora(),
            }
          : p,
      ),
    )

    const movimentacao: Movimentacao = {
      id: crypto.randomUUID(),
      produtoId: movProduto.id,
      nome: movProduto.nome,
      tipo,
      quantidade: qtd,
      data: agora(),
    }

    setMovs((prev) => [movimentacao, ...prev])
    setMovProduto(null)
    setQtd(1)
  }

  return (
    <section className="module-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">PRODUTOS E MATERIAIS</p>
          <h2>Controle de Estoque e Insumos</h2>
          <p className="muted">
            Cadastre produtos, registre entradas e saídas e monitore
            o estoque mínimo.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setNovo(true)}
        >
          <Plus size={18} /> Cadastrar produto
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Produtos cadastrados</span>
          <strong>{produtos.length}</strong>
          <Boxes />
        </div>

        <div className="stat-card">
          <span>Estoque baixo</span>
          <strong>{baixo.length}</strong>
          <AlertTriangle />
        </div>

        <div className="stat-card">
          <span>Unidades em estoque</span>
          <strong>
            {produtos.reduce((soma, p) => soma + p.quantidade, 0)}
          </strong>
          <PackageCheck />
        </div>

        <div className="stat-card">
          <span>Valor em estoque</span>
          <strong className="money-stat">{brl(valor)}</strong>
          <Boxes />
        </div>
      </div>

      {baixo.length > 0 && (
        <div className="stock-alert">
          <AlertTriangle />
          <div>
            <strong>Atenção: estoque mínimo</strong>
            <p>
              {baixo.map((p) => p.nome).join(', ')} está/estão
              no limite mínimo ou abaixo dele.
            </p>
          </div>
        </div>
      )}

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h3>Inventário de produtos</h3>
            <p className="muted">
              Consulte quantidades e registre movimentações.
            </p>
          </div>

          <div className="filters">
            <label className="search-box">
              <Search size={17} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar produto..."
              />
            </label>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Todas</option>
              <option>Livros</option>
              <option>Papelaria</option>
              <option>Insumos</option>
              <option>Outros</option>
            </select>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="empty-state">
            <Boxes size={36} />
            <strong>Nenhum produto encontrado</strong>
            <p>Cadastre produtos para começar.</p>
            <button
              className="secondary-btn"
              onClick={() => setNovo(true)}
            >
              Cadastrar produto
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Quantidade</th>
                  <th>Mínimo</th>
                  <th>Custo unitário</th>
                  <th>Valor total</th>
                  <th>Movimentar</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.nome}</strong>
                      <small>{p.id}</small>
                    </td>

                    <td>
                      <span className="category-tag">
                        {p.categoria}
                      </span>
                    </td>

                    <td>
                      <strong>{p.quantidade}</strong>
                      {p.quantidade <= p.minimo && (
                        <small className="low-stock">Estoque baixo</small>
                      )}
                    </td>

                    <td>{p.minimo} un.</td>
                    <td>{brl(p.custo)}</td>
                    <td><strong>{brl(p.quantidade * p.custo)}</strong></td>

                    <td>
                      <button
                        className="movement-btn"
                        onClick={() => {
                          setMovProduto(p)
                          setTipo('Entrada')
                          setQtd(1)
                        }}
                      >
                        Entrada / saída
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        aria-label={`Excluir produto ${p.nome}`}
                        title="Excluir produto"
                        onClick={() => remover(p)}
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

      <div className="content-card movement-history">
        <div className="table-toolbar">
          <div>
            <h3>
              <History className="inline-icon" size={17} />
              Histórico de movimentações
            </h3>
            <p className="muted">
              Registros mais recentes primeiro.
            </p>
          </div>
        </div>

        {movs.length === 0 ? (
          <p className="history-empty">
            Nenhuma movimentação registrada.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {movs.slice(0, 8).map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.nome}</strong>
                      <small>{m.produtoId}</small>
                    </td>

                    <td>
                      <span
                        className={`movement-type ${
                          m.tipo === 'Entrada' ? 'entry' : 'exit'
                        }`}
                      >
                        {m.tipo === 'Entrada' ? (
                          <ArrowDownToLine size={14} />
                        ) : (
                          <ArrowUpFromLine size={14} />
                        )}
                        {m.tipo}
                      </span>
                    </td>

                    <td>{m.quantidade} un.</td>
                    <td>{m.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {novo && (
        <div
          className="modal-backdrop"
          onClick={() => setNovo(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Cadastrar produto</h3>
                <p className="muted">Informe os dados do item.</p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setNovo(false)}
                type="button"
              >
                <X />
              </button>
            </div>

            <form className="form-grid" onSubmit={cadastrar}>
              <label className="full-field">
                Nome do produto
                <input
                  required
                  value={form.nome}
                  onChange={(e) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                  placeholder="Ex.: Caderno universitário"
                />
              </label>

              <label>
                Categoria
                <select
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoria: e.target.value as Categoria,
                    })
                  }
                >
                  <option>Livros</option>
                  <option>Papelaria</option>
                  <option>Insumos</option>
                  <option>Outros</option>
                </select>
              </label>

              <label>
                Quantidade inicial
                <input
                  type="number"
                  min="0"
                  required
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantidade: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </label>

              <label>
                Estoque mínimo
                <input
                  type="number"
                  min="0"
                  required
                  value={form.minimo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minimo: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </label>

              <label>
                Custo unitário (R$)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.custo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      custo: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </label>

              <div className="form-actions full-field">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setNovo(false)}
                >
                  Cancelar
                </button>
                <button className="primary-btn">Salvar produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {movProduto && (
        <div
          className="modal-backdrop"
          onClick={() => setMovProduto(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Movimentar estoque</h3>
                <p className="muted">
                  {movProduto.nome} · estoque atual: {movProduto.quantidade} un.
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setMovProduto(null)}
                type="button"
              >
                <X />
              </button>
            </div>

            <form className="movement-form" onSubmit={movimentar}>
              <label>
                Tipo
                <select
                  value={tipo}
                  onChange={(e) =>
                    setTipo(e.target.value as 'Entrada' | 'Saída')
                  }
                >
                  <option>Entrada</option>
                  <option>Saída</option>
                </select>
              </label>

              <label>
                Quantidade
                <input
                  type="number"
                  min="1"
                  required
                  value={qtd}
                  onChange={(e) =>
                    setQtd(Math.max(1, Number(e.target.value)))
                  }
                />
              </label>

              {tipo === 'Saída' && qtd > movProduto.quantidade && (
                <p className="validation-error">
                  A saída não pode ultrapassar o estoque atual.
                </p>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setMovProduto(null)}
                >
                  Cancelar
                </button>

                <button
                  className="primary-btn"
                  disabled={tipo === 'Saída' && qtd > movProduto.quantidade}
                >
                  Confirmar movimentação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
