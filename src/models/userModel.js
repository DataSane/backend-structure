var database = require('../configs/database/connection'); 

async function authLogin(email, senha) {
    console.log('User Model accessed > function autenticarLogin');

    var sqlCommand = `
        SELECT idUsuario, usuario, email, administrador, nomeEmpresa, fkFazenda FROM usuario 
        INNER JOIN empresa 
        ON idEmpresa = fkEmpresa 
        WHERE email = "${email}" AND senha = "${senha}";
    `;
    console.log("Running SQL command: \n" + sqlCommand);

    return await database.execute(sqlCommand).then(resultQuery => {
    
        if (resultQuery && resultQuery.length > 0) {
            // Se houver pelo menos um resultado, significa que o login foi bem-sucedido
            // Após o login bem-sucedido
            return {
                 success: true, 
                 bd_userId: resultQuery[0].idUsuario,
                 bd_userName: resultQuery[0].usuario,
                 bd_userEmail: resultQuery[0].email,
                 bd_userAdmin: resultQuery[0].administrador,
                 bd_userCompany: resultQuery[0].nomeEmpresa,
                 bd_userFazenda: resultQuery[0].fkFazenda
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

async function getEmpresaByUsuario(userId){
    console.log('User Model accessed > function getEmpresaByUsuario');

    var sqlCommand = `
        SELECT empresa.idEmpresa
        FROM empresa
        JOIN usuario ON empresa.idEmpresa = usuario.fkEmpresa
        WHERE usuario.idUsuario = ${userId}; 
    `;

    console.log('Running SQL command: \n' + sqlCommand);

    return await database.execute(sqlCommand).then(resultQuery => {
    
        if (resultQuery && resultQuery.length > 0) {
            // Se houver pelo menos um resultado, significa que o login foi bem-sucedido
            // Após o login bem-sucedido
            return {
                 success: true, 
                 bd_idEmpresa: resultQuery[0].idEmpresa,
            };
        } else {
            // Se o resultado estiver vazio, significa que o login falhou
            return { 
                success: false
            };
        }
    })
    .catch(error => {
        // Se ocorrer um erro durante a execução da consulta SQL, capture e manipule-o aqui
        console.error(error);
        return { success: false };
    });;
}

async function isAdmin(userId){
    console.log('User model accessed > isAdmin');

    const sqlCommand = `
        SELECT administrador FROM usuario 
        WHERE idUsuario = ?;
    `;

    const resultQuery = await database.execute(sqlCommand, userId);


    return resultQuery[0].administrador;
}
async function getFazendas(userId){
    console.log('User model accessed > function getFazendas');

    const isUserAdmin = await isAdmin(userId);

    const empresaResponse = await getEmpresaByUsuario(userId);


    if(empresaResponse.success){
        
        if(isUserAdmin == 1){
            const sqlCommand = `
                SELECT * FROM fazenda
                WHERE fkEmpresa = ?;
             `
             console.log('Running SQL command: \n'+ sqlCommand);

             const resultQuery = await database.execute(sqlCommand, [empresaResponse.bd_idEmpresa]);


             if (resultQuery && resultQuery.length > 0) {
                return {
                    success: true,
                    bd_fazendas: resultQuery,
                };
            } else {
                return {
                    success: false,
                    message: 'Credenciais de login inválidas.',
                };
            }
        }else{
            console.log('section')
            const sqlCommand = `
                SELECT fazenda.*
                FROM usuario
                JOIN fazenda ON usuario.fkFazenda = fazenda.idFazenda
                WHERE usuario.idUsuario = ?;
             `
             console.log('Running SQL command: \n'+ sqlCommand);

             const resultQuery = await database.execute(sqlCommand, userId);


             if (resultQuery && resultQuery.length > 0) {
                return {
                    success: true,
                    bd_fazendas: resultQuery,
                };
            } else {
                return {
                    success: false
                };
            }
        }
    }
}
async function getMonitorsRegistered(userId) {
    console.log('User Model accessed > function getMonitorRegistered');

    const empresaResponse = await getEmpresaByUsuario(userId);
        
    if (empresaResponse.success) {
        const sqlCommand = `
            SELECT idUsuario, usuario, email, administrador, fkFazenda
            FROM usuario 
            WHERE fkEmpresa = ? ;
        `;
        
        console.log('Running SQL command: \n' + sqlCommand);

        const resultQuery = await database.execute(sqlCommand, [empresaResponse.bd_idEmpresa]);

        if (resultQuery && resultQuery.length > 0) {
            return {
                success: true,
                bd_monitors: resultQuery,
            };
        } else {
            return {
                success: false,
                message: 'Credenciais de login inválidas.',
            };
        }
    } else {
        return {
            success: false,
            message: 'Error to get monitors registered',
        };
    }
}

async function registerMonitor(idAdmin, username, email, password){
    console.log('User Model accessed > function registerMonitor');

    const empresaResponse = await getEmpresaByUsuario(idAdmin);

    if(empresaResponse.success) {
        const sqlCommand = `
            INSERT INTO usuario VALUE (DEFAULT, ?, ?, ?, FALSE, ?, NULL)
        `;

        console.log('Running SQL command: \n' + sqlCommand);

        return await database.execute(sqlCommand, [username, email, password, empresaResponse.bd_idEmpresa]);

    }else {
        return {
            success: false,
            message: 'Error to get monitors registered',
        };
    }
}

async function addMonitorToFazenda(idFazenda, idMonitor){
    console.log('User Model accessed > function addMonitorToFazenda');

    console.log(idMonitor)

    const sqlCommand = `
        UPDATE usuario
        SET fkFazenda = ?
        WHERE idUsuario = ?;
    `;

    return await database.execute(sqlCommand, [idFazenda, idMonitor]);
}



module.exports = {
    authLogin,
    getEmpresaByUsuario,
    getMonitorsRegistered,
    registerMonitor,
    getFazendas,
    addMonitorToFazenda
};

