const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.get('/', (req, res) => {
    res.json({ usuarios: [{ id: 1, nome: 'João' }, { id: 2, nome: 'Maria' }] });
});

router.post('/login', userController.login);

router.get('/:id', (req, res) => {
    res.json({ id: req.params.id, nome: 'João' });
});

module.exports = router;