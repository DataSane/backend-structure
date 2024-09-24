const express = require('express');
const router = express.Router();
const medidaController = require('../controllers/medidaController');

// Rota raiz dentro do grupo /
router.get('/ultimas/:fazendaId', function(req, res) {
    medidaController.searchLastOne(req, res);
});

module.exports = router;