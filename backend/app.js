// ======= MÓDULOS GERENCIADORES =======
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const session = require('express-session');

// ========= EXPRESS SETUP ==============
const express = require('express');
const app = express();

// ============ MIDDLEWARES =============
// Configuração do EJS (mantenha isso se você ainda quer renderizar views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
app.use(cors());


// Configuração do CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL do seu frontend
    credentials: true
}));

// Middleware de sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'sptech',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Middleware para lidar com erros de sessão
app.use((req, res, next) => {
    if (req.session && req.session.error) {
        res.locals.error = req.session.error;
        delete req.session.error;
    }
    next();
});

// ======= DEFINIÇÃO DE ROTAS ==========
// Rotas para renderização de HTML
const webRoutes = require('./src/routes/web/index');
app.use('/', webRoutes);

// Rotas da API
const apiRoutes = require('./src/routes/api/index');
app.use('/api', apiRoutes);

// Use outras rotas conforme necessário

// Middleware para lidar com rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware para lidar com erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

// ========= ABRINDO SERVIDOR ==========
const HOST = process.env.SV_HOST || 'localhost';
const PORT = process.env.SV_PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

try {
    app.listen(PORT, () => {
        console.log(`Preparando o ambiente \x1b[33m${ENVIRONMENT}\x1b[0m...`);
        console.log(`\x1b[32mServidor rodando em http://${HOST}:${PORT} \x1b[0m`);
    });
} catch (e) {
    console.log(`\x1b[31mErro ao inicializar o servidor\x1b[0m\n${e}`);
}

// var database = require('./src/configs/database/connection');
// console.log(database.execute('SELECT * FROM usuario LIMIT 1'));