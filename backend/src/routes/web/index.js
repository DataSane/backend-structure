// src/routes/web/index.js
const express = require('express');
const router = express.Router();

const loginRoutes = require('./login');
const dashboardRoutes = require('./dashboard');

router.use('/', loginRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;