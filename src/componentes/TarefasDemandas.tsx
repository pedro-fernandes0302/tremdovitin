import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, ClipboardCheck, Plus, Trash2, X } from 'lucide-react'
import '../novos-modulos.css'

type Tarefa = { id: string; titulo: string; responsavel: string; prioridade: 'Baixa' | 'Média' | 'Alta'; status: 'A fazer' | 'Em andamento' | 'Concluída'; prazo: string }
const KEY = 'livraria-tarefas-v1'

export default function TarefasDemandas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Omit<Tarefa, 'id'>>({ titulo: '', responsavel: '', prioridade: 'Média', status: 'A fazer', prazo: '' })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(tarefas)) }, [tarefas])

  const salvar = (event: FormEvent) => {
    event.preventDefault()
    setTarefas((lista) => [...lista, { id: crypto.randomUUID(), ...form }])
    setForm({ titulo: '', responsavel: '', prioridade: 'Média', status: 'A fazer', prazo: '' })
    setModal(false)
  }

  const alterarStatus = (id: string, status: Tarefa['status']) => setTarefas((lista) => lista.map((tarefa) => tarefa.id === id ? { ...tarefa, status } : tarefa))

  return (
    <section className="module-page new-module">
      <div className="page-intro"><div><p className="eyebrow">NOVO MÓDULO 03</p><h2>Tarefas e Demandas</h2><p className="muted">Organize atividades, prioridades, prazos e responsáveis.</p></div><button className="primary-btn" onClick={() => setModal(true)}><Plus size={17} /> Nova tarefa</button></div>
      <div className="stats-grid">
        <article className="stat-card"><ClipboardCheck /><span>Total</span><strong>{tarefas.length}</strong></article>
        <article className="stat-card"><ClipboardCheck /><span>A fazer</span><strong>{tarefas.filter((t) => t.status === 'A fazer').length}</strong></article>
        <article className="stat-card"><ClipboardCheck /><span>Em andamento</span><strong>{tarefas.filter((t) => t.status === 'Em andamento').length}</strong></article>
        <article className="stat-card"><CheckCircle2 /><span>Concluídas</span><strong>{tarefas.filter((t) => t.status === 'Concluída').length}</strong></article>
      </div>
      <div className="content-card table-wrap"><table className="data-table"><thead><tr><th>Tarefa</th><th>Responsável</th><th>Prioridade</th><th>Prazo</th><th>Status</th><th>Excluir</th></tr></thead><tbody>
        {tarefas.map((tarefa) => <tr key={tarefa.id}><td><strong>{tarefa.titulo}</strong></td><td>{tarefa.responsavel}</td><td><span className={`priority priority-${tarefa.prioridade.toLowerCase()}`}>{tarefa.prioridade}</span></td><td>{tarefa.prazo}</td><td><select value={tarefa.status} onChange={(e) => alterarStatus(tarefa.id, e.target.value as Tarefa['status'])} className="module-status"><option>A fazer</option><option>Em andamento</option><option>Concluída</option></select></td><td><button className="icon-btn delete-btn" onClick={() => setTarefas((lista) => lista.filter((item) => item.id !== tarefa.id))}><Trash2 size={16} /></button></td></tr>)}
      </tbody></table>{!tarefas.length && <div className="empty-state">Nenhuma tarefa cadastrada.</div>}</div>
      {modal && <div className="modal-backdrop" onMouseDown={() => setModal(false)}><div className="modal-card new-module-modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-header"><div><h3>Nova demanda</h3><p className="muted">Defina responsável, prioridade e prazo.</p></div><button className="icon-btn" onClick={() => setModal(false)}><X /></button></div><form onSubmit={salvar} className="new-module-form"><label>Tarefa<input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></label><label>Responsável<input required value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></label><div className="form-grid"><label>Prioridade<select value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value as Tarefa['prioridade'] })}><option>Baixa</option><option>Média</option><option>Alta</option></select></label><label>Prazo<input required type="date" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} /></label></div><div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancelar</button><button type="submit" className="primary-btn">Salvar tarefa</button></div></form></div></div>}
    </section>
  )
}
