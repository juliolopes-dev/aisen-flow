import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { Tarefa, TarefaFormData } from '../types/tarefa';

interface ModalTarefaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TarefaFormData) => Promise<void>;
  tarefa?: Tarefa | null;
}

export function ModalTarefa({ isOpen, onClose, onSave, tarefa }: ModalTarefaProps) {
  const [formData, setFormData] = useState<TarefaFormData>({
    titulo: '',
    descricao: '',
    urgente: false,
    importante: true,
    justificativa: '',
    responsavel: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tarefa) {
      setFormData({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || '',
        urgente: tarefa.urgente,
        importante: tarefa.importante,
        justificativa: tarefa.justificativa || '',
        responsavel: tarefa.responsavel || '',
      });
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        urgente: false,
        importante: true,
        justificativa: '',
        responsavel: '',
      });
    }
    setError('');
  }, [tarefa, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      setError('Título é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const getQuadrante = () => {
    if (formData.urgente && formData.importante) return { num: 1, label: 'Q1 - Fazer Agora', color: 'bg-red-100 text-red-800' };
    if (!formData.urgente && formData.importante) return { num: 2, label: 'Q2 - Agendar', color: 'bg-blue-100 text-blue-800' };
    if (formData.urgente && !formData.importante) return { num: 3, label: 'Q3 - Delegar', color: 'bg-yellow-100 text-yellow-800' };
    return { num: 4, label: 'Q4 - Eliminar', color: 'bg-gray-100 text-gray-800' };
  };

  if (!isOpen) return null;

  const quadrante = getQuadrante();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descreva a tarefa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.urgente}
                onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })}
                className="w-5 h-5 rounded text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="font-medium text-gray-800">Urgente</span>
                <p className="text-xs text-gray-500">Precisa ser feito logo</p>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.importante}
                onChange={(e) => setFormData({ ...formData, importante: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-800">Importante</span>
                <p className="text-xs text-gray-500">Impacta nos objetivos</p>
              </div>
            </label>
          </div>

          <div className="text-center">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${quadrante.color}`}>
              {quadrante.label}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificativa
            </label>
            <input
              type="text"
              value={formData.justificativa}
              onChange={(e) => setFormData({ ...formData, justificativa: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Por que esta tarefa é importante?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsável (opcional)
            </label>
            <input
              type="text"
              value={formData.responsavel}
              onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nome da pessoa responsável"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
