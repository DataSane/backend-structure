const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fazendaController = require('../controllers/fazendaController');

router.get('/', async function(req, res){
    if (req.session.authenticated) {

        const fazendaId = req.params.fazendaId;

        // dados do usuário
        const user = req.session.user;

        let fazendasResponse;
        let fazendas;

        fazendasResponse = await userController.getFazendas(user.session_userId);
        fazendas = fazendasResponse.bd_fazendas;


        res.render('fazendas', {
            userId: user.session_userId,
            userName: user.session_userName,
            userEmail: user.session_userEmail,
            userAdmin: user.session_userAdmin,
            userCompany: user.session_userCompany,
            userFazenda: user.session_userFazenda,
            fazendaId: fazendaId,
            fazendas: fazendas
        });


    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes de acessar as fazendas!'
        res.redirect('/');
    }
})

router.get('/iframe', async function(req, res){
    if (req.session.authenticated) {

        let hasError = false;
        let errorMessage = '';

        let hasBeenRegistered = false;

        if(req.session.hasError){
            hasError = true;
            errorMessage = req.session.errorMessage;

            delete req.session.hasError;
            delete req.session.errorMessage;
        }

        if(req.session.hasBeenRegistered){
            hasBeenRegistered = true;
            delete req.session.hasBeenRegistered
        }
        
        // dados do usuário
        const user = req.session.user;
        res.render('fazendasIframe', {
            userId: user.session_userId,
            hasError: hasError,
            errorMessage: errorMessage,
            hasBeenRegistered: hasBeenRegistered
        });

    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes para registrar monitores!'
        res.redirect('/');
    }

})

router.post('/register', async (req,res)=>{
    if (req.session.authenticated) {
        await fazendaController.registerFazenda(req,res);
        res.redirect('/fazenda/iframe');

    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes para registrar fazendas!'
        res.redirect('/');
    }
})

router.get('/:fazendaId', async function(req, res){
    if (req.session.authenticated) {

        const fazendaId = req.params.fazendaId;

        // dados do usuário
        const user = req.session.user;

        let fazendasResponse;
        let fazendas;

        fazendasResponse = await userController.getFazendas(user.session_userId);
        fazendas = fazendasResponse.bd_fazendas;

        const monitorsResponse = await userController.getMonitorsRegistered(user.session_userId);
        const monitors = monitorsResponse.bd_monitors;

        const statusSensor = await fazendaController.getStatusSensor(user.session_userId);-

        console.log(statusSensor)

        res.render('fazenda', {
            userId: user.session_userId,
            userName: user.session_userName,
            userEmail: user.session_userEmail,
            userAdmin: user.session_userAdmin,
            userCompany: user.session_userCompany,
            userFazenda: user.session_userFazenda,
            fazendaId: fazendaId,
            fazendas: fazendas,
            monitors: monitors,
            sensor: statusSensor
        });


    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes de acessar as fazendas!'
        res.redirect('/');
    }
})

router.post('/addMonitor', async (req,res)=>{
    if (req.session.authenticated) {
        await userController.addMonitorToFazenda(req,res);
        res.redirect('/monitor')

    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes para registrar monitores!'
        res.redirect('/');
    }
})

// testando um ngc n mexe please
module.exports = router;