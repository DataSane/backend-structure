var testeModel = require('../models/testeModel'); // requerindo o modelo pra interface com o banco de dados


// função pertencente ao controlador
//  para validar os dados do cadastro na REQuisição
function validarCadastro(req,res){

    // passando os dados da requisição pra variavel
    var representante = req.body.representante;
    var email = req.body.email;
    var senha = req.body.senha;
    
    // apresenta os dados no console
    console.log(`
        Representante: ${representante}   \n
        Email: ${email} \n
        Senha: ${senha}      
    `)

    // utilizando da função cadastrar do testeModel
    // passando como "parametro" as variaveis acimna
    testeModel.cadastrar(representante, email, senha).then(function(resultado){
        // pós executar a função cadastar, ENTÃO (then), executa essa função
        // que retorna o "resultado"

        // no console, este resultado é um "json" com success, e message
        console.log(resultado);

        // verificamos se o success é TRUE, se for true, então 
        if(resultado.success){
            req.session.foiCadastrado = true
            res.redirect('/teste')
        }else{ // senão
            req.session.foiCadastrado = false
            console.log('Algum erro ocorreu ao cadastrar teste')
            res.redirect('/teste')
        }

    })
}

// exportando a função pra fora, podendo utilizar fora do arquivo 
//  quando requisitado 
module.exports = {
    validarCadastro
}