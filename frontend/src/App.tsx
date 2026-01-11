import { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Tarefa, Stats, TarefaFormData } from './types/tarefa';
import { api } from './services/api';
import { Header } from './components/Header';
import { Quadrante } from './components/Quadrante';
import { ModalTarefa } from './components/ModalTarefa';
import { ModalConfirmacao } from './components/ModalConfirmacao';
import { Toast } from './components/Toast';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [tarefas, setTarefas] = useState<Record<number, Tarefa[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [filtros, setFiltros] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
  });

  const [modalTarefaOpen, setModalTarefaOpen] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);
  
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [tarefaExcluindo, setTarefaExcluindo] = useState<number | null>(null);
  const [excluindoLoading, setExcluindoLoading] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const carregarTarefas = useCallback(async () => {
    try {
      const [q1, q2, q3, q4] = await Promise.all([
        api.listarPorQuadrante(1),
        api.listarPorQuadrante(2),
        api.listarPorQuadrante(3),
        api.listarPorQuadrante(4),
      ]);
      setTarefas({ 1: q1, 2: q2, 3: q3, 4: q4 });
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      showToast('Erro ao carregar tarefas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarStats = useCallback(async () => {
    try {
      const data = await api.estatisticas();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
    carregarStats();

    const interval = setInterval(() => {
      carregarTarefas();
      carregarStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [carregarTarefas, carregarStats]);

  const handleConcluir = async (id: number) => {
    try {
      await api.concluir(id);
      showToast('Tarefa concluída com sucesso!', 'success');
      carregarTarefas();
      carregarStats();
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      showToast('Erro ao concluir tarefa', 'error');
    }
  };

  const handleExcluir = (id: number) => {
    setTarefaExcluindo(id);
    setModalConfirmOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!tarefaExcluindo) return;

    setExcluindoLoading(true);
    try {
      await api.excluir(tarefaExcluindo);
      showToast('Tarefa excluída com sucesso!', 'success');
      setModalConfirmOpen(false);
      setTarefaExcluindo(null);
      carregarTarefas();
      carregarStats();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      showToast('Erro ao excluir tarefa', 'error');
    } finally {
      setExcluindoLoading(false);
    }
  };

  const handleEditar = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa);
    setModalTarefaOpen(true);
  };

  const handleNovaTarefa = () => {
    setTarefaEditando(null);
    setModalTarefaOpen(true);
  };

  const handleSalvarTarefa = async (data: TarefaFormData) => {
    if (tarefaEditando) {
      await api.atualizar(tarefaEditando.id, data);
      showToast('Tarefa atualizada com sucesso!', 'success');
    } else {
      await api.criar(data);
      showToast('Tarefa criada com sucesso!', 'success');
    }
    carregarTarefas();
    carregarStats();
  };

  const handleFiltroChange = (quadrante: number, status: string) => {
    setFiltros((prev) => ({ ...prev, [quadrante]: status }));
  };

  const getTarefaExcluindo = () => {
    if (!tarefaExcluindo) return null;
    for (const quadrante of Object.values(tarefas)) {
      const tarefa = quadrante.find((t) => t.id === tarefaExcluindo);
      if (tarefa) return tarefa;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header stats={stats} loading={statsLoading} />

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-180px)]">
          {([1, 2, 3, 4] as const).map((num) => (
            <Quadrante
              key={num}
              numero={num}
              tarefas={tarefas[num]}
              loading={loading}
              onConcluir={handleConcluir}
              onExcluir={handleExcluir}
              onEditar={handleEditar}
              filtroStatus={filtros[num]}
              onFiltroChange={(status) => handleFiltroChange(num, status)}
            />
          ))}
        </div>
      </main>

      <button
        onClick={handleNovaTarefa}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all flex items-center justify-center z-40"
        title="Nova Tarefa"
      >
        <FaPlus className="text-xl" />
      </button>

      <ModalTarefa
        isOpen={modalTarefaOpen}
        onClose={() => {
          setModalTarefaOpen(false);
          setTarefaEditando(null);
        }}
        onSave={handleSalvarTarefa}
        tarefa={tarefaEditando}
      />

      <ModalConfirmacao
        isOpen={modalConfirmOpen}
        titulo="Excluir Tarefa"
        mensagem={`Tem certeza que deseja excluir a tarefa "${getTarefaExcluindo()?.titulo || ''}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmarExclusao}
        onCancel={() => {
          setModalConfirmOpen(false);
          setTarefaExcluindo(null);
        }}
        loading={excluindoLoading}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
