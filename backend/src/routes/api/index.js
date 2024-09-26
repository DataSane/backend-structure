// src/routes/api/index.js
const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuario');

router.use('/usuarios', usuarioRoutes);

module.exports = router;