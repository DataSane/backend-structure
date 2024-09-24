var userModel = require('../models/userModel');

function login(req,res){
    var email = req.body.email;
    var senha = req.body.senha;
    
    userModel.authLogin(email,senha).then((resultadoQuery)=>{
            console.log(resultadoQuery.success);
            if(resultadoQuery.success){
                req.session.authenticated = true

                // criando na sessão um "json", com os dados que foi pego do banco 
                req.session.user = {
                    session_userId: resultadoQuery.bd_userId,
                    session_userName: resultadoQuery.bd_userName,
                    session_userEmail: resultadoQuery.bd_userEmail,
                    session_userAdmin: resultadoQuery.bd_userAdmin,
                    session_userCompany: resultadoQuery.bd_userCompany,
                    session_userFazenda: resultadoQuery.bd_userFazenda,
                    session_userSensor: resultadoQuery.bd_userSensor
                };
                res.redirect('/dashboard')
            }else{
                req.session.authenticated = false
                req.session.hasError = true;
                req.session.errorMessage = 'Usuário ou senha incorreta. Tente novamente!'
                res.redirect('/')
            }

        }
    );
}

async function getFazendas(userId){
    return await userModel.getFazendas(userId);
}

async function getMonitorsRegistered(userId){
    return await userModel.getMonitorsRegistered(userId)
}
async function getStatusSensor(userId){
    return await userModel.getStatusSensor(userId)
}

async function registerMonitor(req, res){
    const username = req.body.usuario;
    const email = req.body.email;
    const password = req.body.senha;
    const passwordConfirmation = req.body.senhaConfirmacao;
    const idAdmin = req.body.idAdmin;

    if(username != '' && email != '' && password != '' && passwordConfirmation != '' && idAdmin){
        if(email.includes('@') && email.includes('.')){
            if(password == passwordConfirmation){
                req.session.hasBeenRegistered = true;
                userModel.registerMonitor(idAdmin, username, email, password);
                return true
            }else{
                req.session.hasError = true;
                req.session.errorMessage = 'As senhas não combinam! Tente novamente.'
                return false
            }
        }else{
            req.session.hasError = true;
            req.session.errorMessage = 'Email inválido! Tente outro.'
            return false
        }
    }else{
        req.session.hasError = true;
        req.session.errorMessage = 'Preencha todos os campos!'
        return false
    }

}

async function addMonitorToFazenda(req, res){
    const idMonitor = req.body.idMonitor;
    const idFazenda = req.body.idFazenda;

    if(idMonitor != '#'){
        userModel.addMonitorToFazenda(idFazenda, idMonitor);
        return true;
    }
}
 
module.exports = {
    login,
    getMonitorsRegistered,
    registerMonitor,
    getFazendas,
    addMonitorToFazenda,
    getStatusSensor
}