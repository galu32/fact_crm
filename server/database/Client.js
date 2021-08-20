const Connection = require('./Connection.js');
const promise = require('bluebird');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'crm',
    connectionLimit: 10,
    // acquireTimeout: 10000,
    // timeout: 10000,
    dateStrings: true,
});

pool.on('connection', (connection) => {
    connection.query('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    connection.query('SET SESSION AUTOCOMMIT=0;');
    connection.query('SET SESSION sql_mode=\'\'');
    connection.query('SET SESSION net_read_timeout=120');
});

module.exports = class Client {

    static _pool = pool

    static getConnection = () => {
        const p = promise.pending();
        this._pool.getConnection((err, conn) => {
            if (err) {
                p.reject(err);
            } else {
                p.resolve(new Connection(conn));
            }
        });
        return p.promise;
    }

}