const mysql = require('mysql2/promise');
async function connect(){
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('Conexion a la bd establecida');
        return conn;
    } catch(err) {
        console.error('Ocurrió un error al realizar la conexión con la bd');
        throw err;
    }
}
module.exports = connect;
