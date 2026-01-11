import { FaTrash, FaEdit, FaWhatsapp, FaClock, FaUser, FaLightbulb, FaEnvelope, FaRobot } from 'react-icons/fa';
import { Tarefa } from '../types/tarefa';

interface TarefaCardProps {
  tarefa: Tarefa;
  onConcluir: (id: number) => void;
  onExcluir: (id: number) => void;
  onEditar: (tarefa: Tarefa) => void;
}

export function TarefaCard({ tarefa, onConcluir, onExcluir, onEditar }: TarefaCardProps) {
  const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-800',
    em_progresso: 'bg-blue-100 text-blue-800',
    concluida: 'bg-green-100 text-green-800',
    cancelada: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    pendente: 'Pendente',
    em_progresso: 'Em Progresso',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
  };

  const origemIcon = {
    whatsapp: <FaWhatsapp className="text-green-600" />,
    email: <FaEnvelope className="text-blue-600" />,
    manual: <FaUser className="text-gray-600" />,
    n8n: <FaRobot className="text-purple-600" />,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const spDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const day = spDate.getDate().toString().padStart(2, '0');
    const month = (spDate.getMonth() + 1).toString().padStart(2, '0');
    const hours = spDate.getHours().toString().padStart(2, '0');
    const minutes = spDate.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}, ${hours}:${minutes}`;
  };

  const isConcluida = tarefa.status === 'concluida';

  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 border-l-4 ${
        isConcluida ? 'border-l-green-400 opacity-70' : 'border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isConcluida}
            onChange={() => !isConcluida && onConcluir(tarefa.id)}
            disabled={isConcluida}
            className="w-5 h-5 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-800 truncate ${isConcluida ? 'line-through text-gray-500' : ''}`}>
              {tarefa.titulo}
            </h3>
            
            {tarefa.descricao && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {tarefa.descricao}
              </p>
            )}

            {tarefa.justificativa && (
              <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                <FaLightbulb className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{tarefa.justificativa}</span>
              </p>
            )}

            {tarefa.responsavel && (
              <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
                <FaUser className="flex-shrink-0" />
                <span>Delegado para: {tarefa.responsavel}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEditar(tarefa)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onExcluir(tarefa.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FaClock />
            {formatDate(tarefa.created_at)}
          </span>
          <span className="flex items-center gap-1">
            {origemIcon[tarefa.origem as keyof typeof origemIcon] || origemIcon.manual}
            {tarefa.origem}
          </span>
        </div>

        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[tarefa.status]}`}>
          {statusLabels[tarefa.status]}
        </span>
      </div>
    </div>
  );
}
