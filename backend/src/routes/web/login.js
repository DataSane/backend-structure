const express = require('express');
const router = express.Router();
var userController = require("../../controllers/userController");

// Rota raiz dentro do grupo /
router.get('/', function(req, res) {
    if (!req.session.authenticated) {

        let errorMessage = '';
        let hasError = false;

        if(req.session.hasError){
            errorMessage = req.session.errorMessage;
            hasError = req.session.hasError;

            delete req.session.hasError;
            delete req.session.errorMessage;
            
            console.log(errorMessage);
        }

        res.render('login',{ 
            hasError: hasError,
            errorMessage: errorMessage
         });

    }else{
        res.redirect('/dashboard');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/dashboard'); // Redirecione de volta para o dashboard em caso de erro
        }
        res.clearCookie('connect.sid'); // limpa o cuki de sessão
        res.redirect('/'); // redireciona para a tela de login
    });
});


router.post('/', function(req,res){
    // A solicitação é do tipo POST, então você pode continuar com o processamento
    userController.login(req,res);
});



module.exports = router;