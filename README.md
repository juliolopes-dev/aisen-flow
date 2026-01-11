# Eisen Dashboard - Matriz de Eisenhower

Dashboard web para gerenciar tarefas usando a Matriz de Eisenhower (4 quadrantes de priorização).

## Estrutura do Projeto

```
Aisen-flow/
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── config/    # Configuração do banco
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Quadrantes da Matriz

| Quadrante | Descrição | Cor |
|-----------|-----------|-----|
| Q1 | Urgente + Importante (Fazer Agora) | Vermelho |
| Q2 | Importante + Não Urgente (Agendar) | Azul |
| Q3 | Urgente + Não Importante (Delegar) | Amarelo |
| Q4 | Não Urgente + Não Importante (Eliminar) | Cinza |

## Instalação e Execução

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor backend rodará em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/tarefas | Lista todas as tarefas |
| GET | /api/tarefas/quadrante/:quadrante | Lista tarefas por quadrante |
| GET | /api/tarefas/stats | Estatísticas do dashboard |
| GET | /api/tarefas/:id | Busca tarefa por ID |
| POST | /api/tarefas | Cria nova tarefa |
| PUT | /api/tarefas/:id | Atualiza tarefa |
| PATCH | /api/tarefas/:id/concluir | Marca tarefa como concluída |
| DELETE | /api/tarefas/:id | Exclui tarefa |

## Funcionalidades

- ✅ Visualização em matriz 2x2
- ✅ Listagem de tarefas por quadrante
- ✅ Criar nova tarefa
- ✅ Editar tarefa existente
- ✅ Marcar como concluída
- ✅ Excluir tarefa (com confirmação)
- ✅ Filtros por status
- ✅ Estatísticas no header
- ✅ Auto-refresh a cada 30 segundos
- ✅ Design responsivo
- ✅ Notificações toast

## Stack Tecnológica

### Backend
- Node.js
- Express
- PostgreSQL (pg)
- CORS
- dotenv

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Icons
