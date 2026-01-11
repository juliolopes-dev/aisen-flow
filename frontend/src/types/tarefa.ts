export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string | null;
  urgente: boolean;
  importante: boolean;
  quadrante: 1 | 2 | 3 | 4;
  justificativa: string | null;
  responsavel: string | null;
  status: 'pendente' | 'em_progresso' | 'concluida' | 'cancelada';
  data_lembrete: string | null;
  origem: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Stats {
  urgentes: number;
  agendadas: number;
  concluidasHoje: number;
  porQuadrante: Array<{
    quadrante: number;
    status: string;
    total: string;
  }>;
}

export interface TarefaFormData {
  titulo: string;
  descricao: string;
  urgente: boolean;
  importante: boolean;
  justificativa: string;
  responsavel: string;
}
