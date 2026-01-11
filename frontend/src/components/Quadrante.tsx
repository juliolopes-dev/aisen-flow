import { FaFire, FaCalendarAlt, FaUserFriends, FaArchive } from 'react-icons/fa';
import { Tarefa } from '../types/tarefa';
import { TarefaCard } from './TarefaCard';
import { CardSkeleton } from './Loading';

interface QuadranteProps {
  numero: 1 | 2 | 3 | 4;
  tarefas: Tarefa[];
  loading: boolean;
  onConcluir: (id: number) => void;
  onExcluir: (id: number) => void;
  onEditar: (tarefa: Tarefa) => void;
  filtroStatus: string;
  onFiltroChange: (status: string) => void;
}

const quadranteConfig = {
  1: {
    titulo: 'FAZER AGORA',
    subtitulo: 'Urgente + Importante',
    icon: FaFire,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    headerBg: 'bg-red-500',
    iconColor: 'text-white',
  },
  2: {
    titulo: 'AGENDAR',
    subtitulo: 'Importante + Não Urgente',
    icon: FaCalendarAlt,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    headerBg: 'bg-blue-500',
    iconColor: 'text-white',
  },
  3: {
    titulo: 'DELEGAR',
    subtitulo: 'Urgente + Não Importante',
    icon: FaUserFriends,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    headerBg: 'bg-yellow-500',
    iconColor: 'text-white',
  },
  4: {
    titulo: 'ELIMINAR',
    subtitulo: 'Não Urgente + Não Importante',
    icon: FaArchive,
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    headerBg: 'bg-gray-500',
    iconColor: 'text-white',
  },
};

export function Quadrante({
  numero,
  tarefas,
  loading,
  onConcluir,
  onExcluir,
  onEditar,
  filtroStatus,
  onFiltroChange,
}: QuadranteProps) {
  const config = quadranteConfig[numero];
  const Icon = config.icon;

  const tarefasFiltradas = filtroStatus
    ? tarefas.filter((t) => t.status === filtroStatus)
    : tarefas;

  const pendentesCount = tarefas.filter((t) => t.status !== 'concluida' && t.status !== 'cancelada').length;

  return (
    <div className={`${config.bgColor} rounded-xl border-2 ${config.borderColor} flex flex-col h-full`}>
      <div className={`${config.headerBg} p-4 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`text-2xl ${config.iconColor}`} />
            <div>
              <h2 className="font-bold text-white text-lg">Q{numero} - {config.titulo}</h2>
              <p className="text-white/80 text-xs">{config.subtitulo}</p>
            </div>
          </div>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {pendentesCount}
          </span>
        </div>

        <div className="flex gap-1 mt-3">
          {['', 'pendente', 'em_progresso', 'concluida'].map((status) => (
            <button
              key={status}
              onClick={() => onFiltroChange(status)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filtroStatus === status
                  ? 'bg-white text-gray-800'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {status === '' ? 'Todas' : status === 'pendente' ? 'Pendentes' : status === 'em_progresso' ? 'Em Progresso' : 'Concluídas'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-350px)] space-y-3">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : tarefasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma tarefa{filtroStatus ? ` ${filtroStatus.replace('_', ' ')}` : ''}</p>
          </div>
        ) : (
          tarefasFiltradas.map((tarefa) => (
            <TarefaCard
              key={tarefa.id}
              tarefa={tarefa}
              onConcluir={onConcluir}
              onExcluir={onExcluir}
              onEditar={onEditar}
            />
          ))
        )}
      </div>
    </div>
  );
}
