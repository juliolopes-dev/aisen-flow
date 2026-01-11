import { FaFire, FaCalendarAlt, FaCheckCircle, FaTasks } from 'react-icons/fa';
import { Stats } from '../types/tarefa';

interface HeaderProps {
  stats: Stats | null;
  loading: boolean;
}

export function Header({ stats, loading }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
              <FaTasks className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">EISEN</h1>
              <p className="text-xs text-gray-500">Matriz de Eisenhower</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <StatCard
              icon={<FaFire className="text-red-500" />}
              label="Urgentes"
              value={loading ? '...' : stats?.urgentes ?? 0}
              bgColor="bg-red-50"
            />
            <StatCard
              icon={<FaCalendarAlt className="text-blue-500" />}
              label="Agendadas"
              value={loading ? '...' : stats?.agendadas ?? 0}
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={<FaCheckCircle className="text-green-500" />}
              label="Concluídas Hoje"
              value={loading ? '...' : stats?.concluidasHoje ?? 0}
              bgColor="bg-green-50"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor: string;
}

function StatCard({ icon, label, value, bgColor }: StatCardProps) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bgColor}`}>
      {icon}
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
