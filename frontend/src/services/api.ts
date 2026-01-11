import { Tarefa, Stats, TarefaFormData } from '../types/tarefa';

const API_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }
  return response.json();
}

export const api = {
  async listarTodas(status?: string): Promise<Tarefa[]> {
    const url = status 
      ? `${API_URL}/tarefas?status=${status}` 
      : `${API_URL}/tarefas`;
    const response = await fetch(url);
    return handleResponse<Tarefa[]>(response);
  },

  async listarPorQuadrante(quadrante: number, status?: string): Promise<Tarefa[]> {
    const url = status
      ? `${API_URL}/tarefas/quadrante/${quadrante}?status=${status}`
      : `${API_URL}/tarefas/quadrante/${quadrante}`;
    const response = await fetch(url);
    return handleResponse<Tarefa[]>(response);
  },

  async buscarPorId(id: number): Promise<Tarefa> {
    const response = await fetch(`${API_URL}/tarefas/${id}`);
    return handleResponse<Tarefa>(response);
  },

  async criar(data: TarefaFormData): Promise<Tarefa> {
    const response = await fetch(`${API_URL}/tarefas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Tarefa>(response);
  },

  async atualizar(id: number, data: Partial<TarefaFormData>): Promise<Tarefa> {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Tarefa>(response);
  },

  async concluir(id: number): Promise<Tarefa> {
    const response = await fetch(`${API_URL}/tarefas/${id}/concluir`, {
      method: 'PATCH',
    });
    return handleResponse<Tarefa>(response);
  },

  async excluir(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },

  async estatisticas(): Promise<Stats> {
    const response = await fetch(`${API_URL}/tarefas/stats`);
    return handleResponse<Stats>(response);
  },
};
