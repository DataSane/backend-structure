const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ usuarios: [{ id: 1, nome: 'João' }, { id: 2, nome: 'Maria' }] });
});

router.post('/', (req, res) => {
    res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
});

router.get('/:id', (req, res) => {
    res.json({ id: req.params.id, nome: 'João' });
});

module.exports = router;