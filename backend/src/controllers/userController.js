var userModel = require('../models/userModel');

function login(req,res){
    var email = req.body.email;
    var senha = req.body.senha;
    
    userModel.authLogin(email, senha)
    .then((resultadoQuery) => {
      if (resultadoQuery.success) {
        req.session.authenticated = true;
        req.session.user = {
          session_userId: resultadoQuery.bd_userid,
          session_isadmin: resultadoQuery.bd_isadmin
        };
        
        res.render('dashboard', {
            userid: req.session.user.session_userId,
            isadmin: req.session.user.session_isadmin
        });
        
      } else {
        req.session.authenticated = false;
        req.session.hasError = true;
        req.session.errorMessage = 'Usuário ou senha incorreta. Tente novamente!';
        
        res.redirect('/');
      }
    })
    .catch((error) => {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).json({ mensagem: 'Erro interno no servidor. Tente novamente mais tarde.' });
    });
}

 
module.exports = {
    login
}