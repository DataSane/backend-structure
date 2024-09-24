var database = require('../configs/database/connection');
const userModel = require('../models/userModel');

async function registerFazenda(idAdmin, localidade, cepRural, qtdHec){
    console.log('User Model accessed > function registerFazenda');

    const empresaResponse = await userModel.getEmpresaByUsuario(idAdmin);

    if(empresaResponse.success) {
        const sqlCommand = `
            INSERT INTO fazenda VALUE
                (DEFAULT, ?,?,?,?);
        `;

        console.log('Running SQL command: \n' + sqlCommand);

        return await database.execute(sqlCommand, [localidade, cepRural, qtdHec, empresaResponse.bd_idEmpresa]);

    }else {
        return {
            success: false,
            message: 'Error to get monitors registered',
        };
    }
}

async function countFazendaHec(userId){
    console.log('User model accessed > function countFazendaHec');

    const empresaResponse = await userModel.getEmpresaByUsuario(userId);

    if(empresaResponse.success) {
        const sqlCommand = `
            SELECT 
                COUNT(f.idFazenda) AS totalFazendas,
                SUM(f.qtdHec) AS totalHectares
            FROM 
                empresa e
            JOIN 
                fazenda f ON e.idEmpresa = f.fkEmpresa
            WHERE 
                e.idEmpresa = ?;
        `;

        console.log('Running SQL command: \n' + sqlCommand);

        return await database.execute(sqlCommand, [empresaResponse.bd_idEmpresa]);

    }else {
        return {
            success: false,
            message: 'Error to get monitors registered',
        };
    }
}

async function countSensors(userId){
    console.log('User model accessed > function countFazendaHec');

    const empresaResponse = await userModel.getEmpresaByUsuario(userId);

    if(empresaResponse.success) {
        const sqlCommand = `                          
            SELECT tipo, COUNT(*) AS quantidade
            FROM sensor
            JOIN fazenda ON sensor.fkFazenda = fazenda.idFazenda
            JOIN empresa ON fazenda.fkEmpresa = empresa.idEmpresa
            WHERE empresa.idEmpresa = ?
            GROUP BY tipo;
        `;

        console.log('Running SQL command: \n' + sqlCommand);

        return await database.execute(sqlCommand, [empresaResponse.bd_idEmpresa]);

    }else {
        return {
            success: false,
            message: 'Error to get monitors registered',
        };
    }
}

async function getStatusSensors(userId){
    console.log('User model accessed > function countFazendaHec');

    const empresaResponse = await userModel.getEmpresaByUsuario(userId);

    if(empresaResponse.success) {
        const sqlCommand = `                          
            SELECT 
                tipo,
                estado,
                COUNT(*) AS quantidade
            FROM 
                sensor
            WHERE 
                fkFazenda IN (SELECT idFazenda FROM fazenda WHERE fkEmpresa = ?)
            GROUP BY 
                tipo,
                estado;
        `;

        console.log('Running SQL command: \n' + sqlCommand);

        return await database.execute(sqlCommand, [empresaResponse.bd_idEmpresa]);

    }else {
        return {
            success: false,
            message: 'Error to get monitors registered',
        };
    }
}


module.exports = {
    registerFazenda,
    countFazendaHec,
    countSensors,
    getStatusSensors
};