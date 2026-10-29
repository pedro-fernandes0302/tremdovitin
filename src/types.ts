export type Prioridade = 'Baixa' | 'Média' | 'Alta' | 'Urgente'
export type StatusChamado = 'Aberto' | 'Em andamento' | 'Encerrado'
export type OrigemChamado = 'Interno' | 'Cliente'

export interface Acompanhamento {
  id: string
  texto: string
  data: string
}

export interface Chamado {
  id: string
  titulo: string
  solicitante: string
  origem: OrigemChamado
  prioridade: Prioridade
  descricao: string
  status: StatusChamado
  criadoEm: string
  acompanhamentos: Acompanhamento[]
}

export type Situacao = 'Rascunho' | 'Enviado' | 'Aprovado' | 'Recusado'

export interface ItemOrcamento {
  id: string
  nome: string
  quantidade: number
  valorUnitario: number
}

export interface Orcamento {
  id: string
  cliente: string
  descricao: string
  situacao: Situacao
  data: string
  itens: ItemOrcamento[]
}

export type Categoria = 'Livros' | 'Papelaria' | 'Insumos' | 'Outros'

export interface Produto {
  id: string
  nome: string
  categoria: Categoria
  quantidade: number
  minimo: number
  custo: number
  data: string
}

export interface Movimentacao {
  id: string
  produtoId: string
  nome: string
  tipo: 'Entrada' | 'Saída'
  quantidade: number
  data: string
}
