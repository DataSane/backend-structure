const express = require('express');
const router = express.Router();
var userController = require("../controllers/userController");

// Rota raiz dentro do grupo /dashboard
router.get('/', async (req, res)=> {
    if (req.session.authenticated) {

        // dados do usuário
        const user = req.session.user;

        const monitorsResponse = await userController.getMonitorsRegistered(user.session_userId);
        const monitors = monitorsResponse.bd_monitors;
        
        let fazendasResponse;
        let fazendas;

        fazendasResponse = await userController.getFazendas(user.session_userId);
        fazendas = fazendasResponse.bd_fazendas;
        
        res.render('monitor', {
            userId: user.session_userId,
            userName: user.session_userName,
            userEmail: user.session_userEmail,
            userAdmin: user.session_userAdmin,
            userCompany: user.session_userCompany,
            userFazenda: user.session_userFazenda,
            fazendas: fazendas,
            monitors: monitors
        });

    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes para gerenciar monitores'
        res.redirect('/');
    }
});

router.get('/iframe', (req, res) =>{
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
        res.render('monitorIframe', {
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
});

router.post('/register', async (req,res)=>{
    if (req.session.authenticated) {
        await userController.registerMonitor(req,res);
        res.redirect('/monitor/iframe')

    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Faça login antes para registrar monitores!'
        res.redirect('/');
    }
})



module.exports = router;