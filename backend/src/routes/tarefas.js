const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');

router.get('/stats', tarefasController.estatisticas);

router.get('/', tarefasController.listarTodas);

router.get('/quadrante/:quadrante', tarefasController.listarPorQuadrante);

router.get('/:id', tarefasController.buscarPorId);

router.post('/', tarefasController.criar);

router.put('/:id', tarefasController.atualizar);

router.patch('/:id/concluir', tarefasController.concluir);

router.delete('/:id', tarefasController.excluir);

module.exports = router;
