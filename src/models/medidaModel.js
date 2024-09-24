var database = require('../configs/database/connection');

async function searchLastOne(fazendaId){

    console.log(fazendaId)
    console.log('fffffffffffffffffffffffffffffffff')
    const sqlCommand = `
        SELECT 
            CASE 
                WHEN s.tipo = 'dht11' THEN 'tipo: dht11'
                WHEN s.tipo = 'lm35' THEN 'tipo: lm35'
                ELSE 'tipo: Outro'
            END AS tipo_sensor,
            AVG(sl.dadoCapturado) AS media_dados
        FROM sensor s
        JOIN (
            SELECT sl.*
            FROM sensorLog sl
            JOIN (
                SELECT MAX(idSensorLog) AS idSensorLog
                FROM sensorLog
                GROUP BY fkSensor
            ) AS max_sl ON sl.idSensorLog = max_sl.idSensorLog
        ) AS sl ON s.idSensor = sl.fkSensor
        JOIN fazenda f ON s.fkFazenda = f.idFazenda
        WHERE s.estado = 'ativo'
            AND f.idFazenda = ?
        GROUP BY s.tipo;


    `
    return database.execute(sqlCommand, [fazendaId]);
}
module.exports = {
    searchLastOne
}