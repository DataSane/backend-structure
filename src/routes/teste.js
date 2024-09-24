// ======== TESTE ==========
const express = require('express'); // configurador do servidor web
const router = express.Router(); // middleware que gerencia as rotas
var testeController = require("../controllers/testeController"); // controlador


// rota GET, rota raiz do grupo "/teste"
router.get('/',function(req,res){

    // foiCadastrado começa como falso
    let foiCadastrado = false;

    // se caso na sessão haja a variavel foi cadastrado
    if(req.session.foiCadastrado){
        // setamos a variavel com esse status
        foiCadastrado = req.session.foiCadastrado; 
    }

    // renderizamos o arquivo TESTE
    // enviando a variavel se foi cadastrado ou não
    res.render('teste', { 
        estaCadastrado: foiCadastrado
     });
     
})

// rota POST, que ficara escutando caso requisição chegue aqui enviando algum dado de formulário
// rota dentro do grupo /teste, ou seja /teste/cadastrar
router.post('/cadastrar', function(req,res){
    // pós chegar a requisição POST
    // usa um controlador para validar os dados enviados
    testeController.validarCadastro(req, res);
})


// exportando esse grupo de rotas
module.exports = router;