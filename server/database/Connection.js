const promise = require('bluebird');
// import clshook from 'cls-hooked';

const commitExpectedSetences = ['INSERT', 'UPDATE', 'DELETE'];


module.exports = class Connection {


    constructor(connection) {
        this._conn = connection;
        this._commit_expected = false;
    }

    release = () => this._conn.release();

    query = (query = '', placeholders = []) => {
        console.log(query);
        if (commitExpectedSetences.includes(query.split('')[0])) {
            this._commit_expected = true;
        }
        const p = promise.pending();
        this._conn.query(query, placeholders, (error, results) => {
            if (error) {
                return p.reject(error);
            } else {
                p.resolve(results);
            }
        });
        return p.promise;
    }
    
    CommitOrRollback = (method) => {
        const p = promise.pending();
        this._conn[method](err => {
            if (err) {
                p.reject(err); 
            } else {
                p.resolve(true);
            }
        });
        return p.promise;
    }

    commit = () => {
        return this.CommitOrRollback('commit');
    }

    rollback = () => {
        return this.CommitOrRollback('rollback');
    }

    startTransaction = () => {
        const p = promise.pending();
        this._conn.beginTransaction(err => {
            if (err) {
                this.Rollback()
                    .then(() => p.reject(err));
            } else {
                p.resolve(true);
            }
        });
        return p.promise;
    }

};