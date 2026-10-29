import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Building2, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import '../novos-modulos.css'

type Pedido = {
  id: string
  fornecedor: string
  produto: string
  quantidade: number
  valor: number
  status: 'Pendente' | 'Cotado' | 'Aprovado' | 'Recebido'
}

const KEY = 'livraria-compras-v1'

export default function FornecedoresCompras() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ fornecedor: '', produto: '', quantidade: 1, valor: 0, status: 'Pendente' as Pedido['status'] })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(pedidos)) }, [pedidos])

  const salvar = (event: FormEvent) => {
    event.preventDefault()
    setPedidos((lista) => [...lista, { id: crypto.randomUUID(), ...form }])
    setForm({ fornecedor: '', produto: '', quantidade: 1, valor: 0, status: 'Pendente' })
    setModal(false)
  }

  const atualizarStatus = (id: string, status: Pedido['status']) =>
    setPedidos((lista) => lista.map((pedido) => pedido.id === id ? { ...pedido, status } : pedido))

  return (
    <section className="module-page new-module">
      <div className="page-intro">
        <div>
          <p className="eyebrow">NOVO MÓDULO 01</p>
          <h2>Fornecedores e Compras</h2>
          <p className="muted">Cadastre parceiros, compare cotações e acompanhe reposições.</p>
        </div>
        <button className="primary-btn" onClick={() => setModal(true)}>
          <Plus size={17} /> Novo pedido
        </button>
      </div>

      <div className="stats-grid">
        <article className="stat-card"><Building2 /><span>Pedidos</span><strong>{pedidos.length}</strong></article>
        <article className="stat-card"><ShoppingCart /><span>Aguardando cotação</span><strong>{pedidos.filter((p) => p.status === 'Pendente').length}</strong></article>
        <article className="stat-card"><ShoppingCart /><span>Aprovados</span><strong>{pedidos.filter((p) => p.status === 'Aprovado').length}</strong></article>
        <article className="stat-card"><ShoppingCart /><span>Total estimado</span><strong className="money-stat">{pedidos.reduce((total, p) => total + p.quantidade * p.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></article>
      </div>

      <div className="content-card table-wrap">
        <table className="data-table">
          <thead><tr><th>Fornecedor</th><th>Produto</th><th>Quantidade</th><th>Valor estimado</th><th>Status</th><th>Excluir</th></tr></thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td><strong>{pedido.fornecedor}</strong></td>
                <td>{pedido.produto}</td>
                <td>{pedido.quantidade}</td>
                <td>{(pedido.quantidade * pedido.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>
                  <select value={pedido.status} onChange={(e) => atualizarStatus(pedido.id, e.target.value as Pedido['status'])} className={`module-status status-${pedido.status.toLowerCase()}`}>
                    <option>Pendente</option><option>Cotado</option><option>Aprovado</option><option>Recebido</option>
                  </select>
                </td>
                <td><button className="icon-btn delete-btn" onClick={() => setPedidos((lista) => lista.filter((item) => item.id !== pedido.id))} aria-label="Excluir pedido"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pedidos.length && <div className="empty-state">Nenhum pedido cadastrado.</div>}
      </div>

      {modal && <div className="modal-backdrop" onMouseDown={() => setModal(false)}>
        <div className="modal-card new-module-modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-header"><div><h3>Novo pedido de reposição</h3><p className="muted">Informe fornecedor, item e cotação.</p></div><button className="icon-btn" onClick={() => setModal(false)}><X /></button></div>
          <form onSubmit={salvar} className="new-module-form">
            <label>Fornecedor<input required value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} /></label>
            <label>Produto<input required value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })} /></label>
            <div className="form-grid"><label>Quantidade<input required type="number" min="1" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} /></label><label>Valor unitário<input required type="number" min="0" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} /></label></div>
            <div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancelar</button><button type="submit" className="primary-btn">Salvar pedido</button></div>
          </form>
        </div>
      </div>}
    </section>
  )
}
