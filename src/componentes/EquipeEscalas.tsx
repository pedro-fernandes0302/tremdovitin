import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { CalendarDays, Plus, Trash2, Users, X } from 'lucide-react'
import '../novos-modulos.css'

type Escala = { id: string; colaborador: string; turno: 'Manhã' | 'Tarde' | 'Noite'; atividade: string; data: string; disponibilidade: 'Disponível' | 'Indisponível' }
const KEY = 'livraria-escalas-v1'

export default function EquipeEscalas() {
  const [escalas, setEscalas] = useState<Escala[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Omit<Escala, 'id'>>({ colaborador: '', turno: 'Manhã', atividade: '', data: '', disponibilidade: 'Disponível' })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(escalas)) }, [escalas])

  const salvar = (event: FormEvent) => {
    event.preventDefault()
    setEscalas((lista) => [...lista, { id: crypto.randomUUID(), ...form }])
    setForm({ colaborador: '', turno: 'Manhã', atividade: '', data: '', disponibilidade: 'Disponível' })
    setModal(false)
  }

  return (
    <section className="module-page new-module">
      <div className="page-intro"><div><p className="eyebrow">NOVO MÓDULO 02</p><h2>Equipe e Escalas</h2><p className="muted">Organize turnos, atividades e disponibilidade da equipe.</p></div><button className="primary-btn" onClick={() => setModal(true)}><Plus size={17} /> Nova escala</button></div>
      <div className="stats-grid">
        <article className="stat-card"><Users /><span>Alocações</span><strong>{escalas.length}</strong></article>
        <article className="stat-card"><CalendarDays /><span>Turnos manhã</span><strong>{escalas.filter((e) => e.turno === 'Manhã').length}</strong></article>
        <article className="stat-card"><CalendarDays /><span>Turnos tarde</span><strong>{escalas.filter((e) => e.turno === 'Tarde').length}</strong></article>
        <article className="stat-card"><CalendarDays /><span>Disponíveis</span><strong>{escalas.filter((e) => e.disponibilidade === 'Disponível').length}</strong></article>
      </div>
      <div className="content-card table-wrap">
        <table className="data-table"><thead><tr><th>Colaborador</th><th>Data</th><th>Turno</th><th>Atividade</th><th>Disponibilidade</th><th>Excluir</th></tr></thead><tbody>
          {escalas.map((escala) => <tr key={escala.id}><td><strong>{escala.colaborador}</strong></td><td>{escala.data}</td><td>{escala.turno}</td><td>{escala.atividade}</td><td><span className={`availability ${escala.disponibilidade.toLowerCase()}`}>{escala.disponibilidade}</span></td><td><button className="icon-btn delete-btn" onClick={() => setEscalas((lista) => lista.filter((item) => item.id !== escala.id))}><Trash2 size={16} /></button></td></tr>)}
        </tbody></table>
        {!escalas.length && <div className="empty-state">Nenhuma escala cadastrada.</div>}
      </div>
      {modal && <div className="modal-backdrop" onMouseDown={() => setModal(false)}><div className="modal-card new-module-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header"><div><h3>Adicionar escala</h3><p className="muted">Alocação de colaborador por turno.</p></div><button className="icon-btn" onClick={() => setModal(false)}><X /></button></div>
        <form onSubmit={salvar} className="new-module-form"><label>Colaborador<input required value={form.colaborador} onChange={(e) => setForm({ ...form, colaborador: e.target.value })} /></label><label>Atividade<input required value={form.atividade} onChange={(e) => setForm({ ...form, atividade: e.target.value })} /></label><div className="form-grid"><label>Data<input required type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></label><label>Turno<select value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value as Escala['turno'] })}><option>Manhã</option><option>Tarde</option><option>Noite</option></select></label></div><label>Disponibilidade<select value={form.disponibilidade} onChange={(e) => setForm({ ...form, disponibilidade: e.target.value as Escala['disponibilidade'] })}><option>Disponível</option><option>Indisponível</option></select></label><div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancelar</button><button type="submit" className="primary-btn">Salvar escala</button></div></form>
      </div></div>}
    </section>
  )
}
