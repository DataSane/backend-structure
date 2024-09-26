require('dotenv').config(); // acesso à variáveis de ambiente


// requisição das dependencias do MySQL ou SQL Server
const mysql = require('mysql2');
const sql = require('mssql');


// instância para a conexão com o MySQL
const mySqlConfig = {
    host: process.env.DB_HOST, // servidor localhost
    user: process.env.DB_USER, // super usuário root
    password: process.env.DB_PASSWORD, // senha do super usuário
    database: process.env.DB_NAME, // banco selecionado
}

// instancia para a conexão com SQL Server (Azure Cloud)
var sqlServerConfig = {
        server: process.env.DB_HOST, // link do servidor cloud
        user: process.env.DB_USER, // super usuário root
        password: process.env.DB_PASSWORD, // senha do super usuário
        database: process.env.DB_NAME, // banco selecionado
        pool: {
            max: 10, // máximo de conexão por "pool", por conexão pool
            min: 0, // mínimo de conexão por pool
            idleTimeoutMillis: 30000 // tempo de inatividade antes de encerrar a conexão, a cada pool
        },
        options: {
            encrypt: true, // conexões devem ser criptografadas
        }
    
    }

// função que recebe um comando sql como parametro para ser executado
function execute(sqlCommand, params = []) {
    if (process.env.NODE_ENV == "production") {
        return new Promise(function (resolve, reject) {
            sql.connect(sqlServerConfig).then(function () {
                return sql.query(sqlCommand, params); // Passando os parâmetros aqui
            }).then(function (result) {
                console.log(result);
                resolve(result.recordset);
            }).catch(function (error) {
                reject(error);
                console.log(`\x1b[31m Error when executing SQL command: \n\x1b[0m ${error}`);
            });

            sql.on('error', function (error) {
                return (`\x1b[31m Some error happened in SQL Server (Azure Cloud): \n\x1b[0m ${error} `);
            });
        });
    } else if (process.env.NODE_ENV == "development") {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createConnection(mySqlConfig);
            connection.connect();
            connection.query(sqlCommand, params, function (error, result) { // Passando os parâmetros aqui
                connection.end();
                if (error) {
                    reject(error);
                }
                console.log(result);
                resolve(result);
            });

            connection.on('error', function (error) {
                return (`\x1b[31m Some error happened MySQL (Workbench localhost):\n\x1b[0m ${error.sqlMessage}`);
            });
        });
    } else {
        return new Promise(function (resolve, reject) {
            console.log(`\x1b[31m\nSet the NODE_ENV environment variable to 'production' or 'development' at .env file\n\x1b[0m`);
            reject("Environment variable not set in .env");
        });
    }
}


// exportando essa função para fora, para que seja executada uma conexão com uma instrução sql
module.exports = {
    execute
}