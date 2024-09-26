var database = require('../configs/database/connection'); 

async function authLogin(email, senha) {
    console.log('User Model accessed > function autenticarLogin');

    var sqlCommand = `
        SELECT userid, isadmin FROM user
        WHERE email = "${email}" AND password = "${senha}";
    `;
    console.log("Running SQL command: \n" + sqlCommand);

    return await database.execute(sqlCommand).then(resultQuery => {
    
        if (resultQuery && resultQuery.length > 0) {
            // Se houver pelo menos um resultado, significa que o login foi bem-sucedido
            // Após o login bem-sucedido
            return {
                 success: true, 
                 bd_userId: resultQuery[0].userid,
                 bd_isadmin: resultQuery[0].isadmin
            };
        } else {
            // Se o resultado estiver vazio, significa que o login falhou
            return { 
                success: false,
                 message: 'Credenciais de login inválidas.' 
            };
        }
    })
    .catch(error => {
        // Se ocorrer um erro durante a execução da consulta SQL, capture e manipule-o aqui
        console.error(error);
        return { success: false, message: 'Error to execute auth login' };
    });;
}

async function isAdmin(userId){
    console.log('User model accessed > isAdmin');

    const sqlCommand = `
        SELECT isadmin FROM user 
        WHERE userid = ?;
    `;

    const resultQuery = await database.execute(sqlCommand, userId);


    return resultQuery[0].administrador;
}

module.exports = {
    authLogin,
    isAdmin,
};

