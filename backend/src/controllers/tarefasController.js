const pool = require('../config/database');

const tarefasController = {
  async listarTodas(req, res) {
    try {
      const { status } = req.query;
      let query = 'SELECT * FROM tarefas_eisenhower';
      const params = [];

      if (status) {
        query += ' WHERE status = $1';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
  },

  async listarPorQuadrante(req, res) {
    try {
      const { quadrante } = req.params;
      const { status } = req.query;

      let query = 'SELECT * FROM tarefas_eisenhower WHERE quadrante = $1';
      const params = [quadrante];

      if (status) {
        query += ' AND status = $2';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar tarefas por quadrante:', error);
      res.status(500).json({ error: 'Erro ao listar tarefas por quadrante' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM tarefas_eisenhower WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
  },

  async criar(req, res) {
    try {
      const {
        titulo,
        descricao,
        urgente,
        importante,
        justificativa,
        responsavel,
        data_lembrete,
        origem = 'manual'
      } = req.body;

      if (!titulo) {
        return res.status(400).json({ error: 'Título é obrigatório' });
      }

      let quadrante;
      if (urgente && importante) quadrante = 1;
      else if (!urgente && importante) quadrante = 2;
      else if (urgente && !importante) quadrante = 3;
      else quadrante = 4;

      const result = await pool.query(
        `INSERT INTO tarefas_eisenhower 
         (titulo, descricao, urgente, importante, quadrante, justificativa, responsavel, data_lembrete, origem)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [titulo, descricao, urgente, importante, quadrante, justificativa, responsavel, data_lembrete, origem]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        titulo,
        descricao,
        urgente,
        importante,
        justificativa,
        responsavel,
        status,
        data_lembrete
      } = req.body;

      let quadrante = null;
      if (urgente !== undefined && importante !== undefined) {
        if (urgente && importante) quadrante = 1;
        else if (!urgente && importante) quadrante = 2;
        else if (urgente && !importante) quadrante = 3;
        else quadrante = 4;
      }

      const result = await pool.query(
        `UPDATE tarefas_eisenhower 
         SET titulo = COALESCE($1, titulo),
             descricao = COALESCE($2, descricao),
             urgente = COALESCE($3, urgente),
             importante = COALESCE($4, importante),
             quadrante = COALESCE($5, quadrante),
             justificativa = COALESCE($6, justificativa),
             responsavel = $7,
             status = COALESCE($8, status),
             data_lembrete = $9,
             updated_at = NOW()
         WHERE id = $10
         RETURNING *`,
        [titulo || null, descricao || null, urgente, importante, quadrante, justificativa || null, responsavel || null, status || null, data_lembrete || null, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa', details: error.message });
    }
  },

  async concluir(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE tarefas_eisenhower 
         SET status = 'concluida', 
             completed_at = NOW(),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      res.status(500).json({ error: 'Erro ao concluir tarefa' });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM tarefas_eisenhower WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json({ message: 'Tarefa excluída com sucesso', tarefa: result.rows[0] });
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
  },

  async estatisticas(req, res) {
    try {
      const [urgentes, agendadas, concluidasHoje, totalPorQuadrante] = await Promise.all([
        pool.query(
          "SELECT COUNT(*) as total FROM tarefas_eisenhower WHERE quadrante = 1 AND status != 'concluida' AND status != 'cancelada'"
        ),
        pool.query(
          "SELECT COUNT(*) as total FROM tarefas_eisenhower WHERE quadrante = 2 AND status != 'concluida' AND status != 'cancelada'"
        ),
        pool.query(
          "SELECT COUNT(*) as total FROM tarefas_eisenhower WHERE status = 'concluida' AND DATE(completed_at AT TIME ZONE 'America/Sao_Paulo') = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date"
        ),
        pool.query(
          `SELECT quadrante, status, COUNT(*) as total 
           FROM tarefas_eisenhower 
           GROUP BY quadrante, status`
        )
      ]);

      res.json({
        urgentes: parseInt(urgentes.rows[0].total),
        agendadas: parseInt(agendadas.rows[0].total),
        concluidasHoje: parseInt(concluidasHoje.rows[0].total),
        porQuadrante: totalPorQuadrante.rows
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
};

module.exports = tarefasController;
