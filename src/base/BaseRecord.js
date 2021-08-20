const BaseEntity = require('./BaseEntity.js');
const Queries = require('../../server/database/Queries.js');

const Description = {
    inherits: BaseEntity,
    fields: [
        {fieldName: 'internalId', type: 'integer', primaryKey: true, auto_increment: true},
        {fieldName: 'CreationUser', type: 'string'},
        {fieldName: 'CreatedDate', type: 'date'},
    ]
};

class BaseRecord extends BaseEntity {

    constructor(...args) {
        super(...args);
        this.__fields__ = {};
        this.__old_fields__ = {};
        // this.__is_new__ = true;
        this.__is_modified__ = false;
        this.buildFieldsWrappers();
        this.buildMatrixWrappers();
    }

    name = () => this.__class__.name;

    setIsModified = (v) => this.__is_modified__ = v;

    isModified = () => this.__is_modified__;

    onFieldModified = (fieldName, callback)  => this.on(`FIELD_MODIFIED::${this.name()}::${this.internalId}::${fieldName}`, callback);

    emitFieldModified =(fieldName, value) => this.emit(`FIELD_MODIFIED::${this.name()}::${this.internalId}::${fieldName}`, value);

    buildMatrixWrappers() {
        const {matrixes} = this.getDescription();
        if (matrixes) {
            Object.keys(matrixes).forEach(matrix => {
                const matrixInstance = new matrixes[matrix]();
                matrixInstance.setParentRecord(this);
                Object.defineProperty(this, matrix, {
                    get() {
                        return matrixInstance;
                    },
                    set() {}
                });
            });
        }
    }

    buildFieldsWrappers() {
        const {fields} = this.getDescription();
        if (Array.isArray(fields)) {
            fields.forEach(({fieldName}) => {
                this.__fields__[fieldName] = null;
                Object.defineProperty(this, fieldName, {
                    get() {
                        return this.__fields__[fieldName];
                    },
                    set(value) {
                        if (value !== this.__fields__[fieldName]) {
                            this.setIsModified(true);
                            this.emitFieldModified(fieldName, value);
                            this.__old_fields__[fieldName] = this.__fields__[fieldName];
                            this.__fields__[fieldName] = value;
                        }
                    }
                });
            });
        }
    }

    static getMysqlClient() {
        if (typeof window === 'undefined') {
            return import('../../server/database/Client.js')
                .then(client => client.default);
        }
    }

    static getSyncQuery() {
        return Queries.CREATE_TABLE(this.name, this.getDescription().fields);
    }

    static getMatrixes() {
        const {matrixes} = this.__description__;
        if (matrixes) {
            return Object.keys(matrixes)
                .map(matrix => matrixes[matrix]);
        }
        return [];
    }

    static getMatrixesQueries() {
        const matrixes = this.getMatrixes();
        if (matrixes.length) {
            return matrixes
                .map(matrix => {
                    return Queries.CREATE_TABLE(matrix.name, matrix.getDescription().fields);
                });
        }
        return [];
    }

    static async synchronize() {
        const client = await this.getMysqlClient();
        const con = await client.getConnection();
        const queries = [Queries.CREATE_TABLE(this.name, this.getDescription().fields)];
        await Promise.all(queries.concat(this.getMatrixesQueries())
            .map(({SQL, PLACEHOLDERS}) => con.query(SQL, PLACEHOLDERS))
        );
        con.release();
    }

    toJson() {
        const matrixesNames = this.__class__.getMatrixes()
            .map(matrix => matrix.name);
        const object = {
            fields: this.__fields__,
            matrixes: {},
        };
        matrixesNames.forEach(matrixName => {
            object.matrixes[matrixName] = {
                rows: this[matrixName].getRows()
                    .map(row => row.__fields__),
                removed_rows: this[matrixName].getRemovedRows()
                    .map(row => row.__fields__),
            };
        });
        return object;
    }

    static fromJson(object = {}) {
        const self = new this();
        const {fields, matrixes} = object;
        self.__fields__ = fields || {};
        if (matrixes) {
            Object.keys(matrixes).forEach(matrix => {
                const rows = matrixes[matrix].rows || [];
                const removed = matrixes[matrix].removed_rows || [];
                rows.forEach(jsonRow => {
                    const row = self[matrix].addRow();
                    row.__fields__ = jsonRow;
                });
                removed.forEach(jsonRow => {
                    const row = new self[matrix].__class__();
                    row.__fields__ = jsonRow;
                    self[matrix].__removed_rows__.push(row);
                });
            });
        }
        return self;
    }

    async insertAndGetInternalId (con) {
        const {SQL, PLACEHOLDERS} = Queries.INSERT(this.name(), this.__fields__);
        const res = await con.query(SQL, PLACEHOLDERS);
        this.internalId = res.insertId;
        return res;
    }

    async updateOrThrow (con) {
        const {SQL, PLACEHOLDERS} = Queries.UPDATE(this.name(), this.__fields__);
        const res = await con.query(SQL, PLACEHOLDERS);
        if (!res.affectedRows) {
            throw new Error(`Error: internalId ${this.internalId} for Record ${this.name()} doesn't exists`);
        }
        return res;
    }

    static async getMysqlConnection() {
        const client = await this.getMysqlClient();
        return await client.getConnection();
    }

    async getInitializedMysqlTransaction() {
        const con = await this.__class__.getMysqlConnection();
        await con.startTransaction();
        return con;
    }

    async delete() {
        if (!this.internalId) return;
        const con = await this.getInitializedMysqlTransaction();
        const queries = [Queries.DELETE(this.name(), this.internalId)];
        this.__class__.getMatrixes().forEach(matrixClass => {
            const matrixName = matrixClass.name;
            queries.push(Queries.DELETE(matrixName, this.internalId, 'masterId'));
        });
        try {
            await this.beforeDelete();
            await Promise.all(queries.map(({SQL, PLACEHOLDERS}) => {
                return con.query(SQL, PLACEHOLDERS);
            }));
            await this.afterDelete();
            await con.commit();
        } catch (err) {
            await con.rollback();
            throw err;
        }
    }

    cleanMatrixesRemovedRows() {
        this.__class__.getMatrixes().forEach(matrixClass => {
            const matrixName = matrixClass.name;
            this[matrixName].__removed_rows__ = [];
        });
    }

    async check() {
        //
    }

    async beforeSave() {
        //
    }

    async afterSave() {
        //
    }

    async beforeDelete() {
        //
    }

    async afterDelete() {
        //
    }

    async save() {
        await this.check();
        const con = await this.getInitializedMysqlTransaction();
        const queries = [];
        if (this.internalId) {
            queries.push(this.updateOrThrow.bind(this));
        } else {
            await this.insertAndGetInternalId(con);
        }
        this.__class__.getMatrixes().forEach(matrixClass => {
            const matrixName = matrixClass.name;
            this[matrixName].pasteParentMasterId();
            this[matrixName].getRows().forEach(rowClass => {
                if (rowClass.internalId) {
                    queries.push(Queries.UPDATE(matrixName, rowClass.__fields__));
                } else {
                    queries.push(rowClass.insertAndGetInternalId.bind(rowClass));
                }
            });
            this[matrixName].getRemovedRows().forEach(rowClass => {
                queries.push(Queries.DELETE(matrixName, rowClass.internalId));
            });
        });
        try {
            await this.beforeSave();
            await Promise.all(queries.map(queryOrMethod => {
                if (typeof queryOrMethod === 'function') {
                    return queryOrMethod(con);
                } else {
                    const {SQL, PLACEHOLDERS} = queryOrMethod;
                    return con.query(SQL, PLACEHOLDERS);
                }
            }));
            this.cleanMatrixesRemovedRows();
            await this.afterSave();
            await con.commit();
        } catch (err) {
            await con.rollback();
            throw err;
        }
    }

    thisFromJson({fields, matrixes = {}}) {
        for (const field in fields) {
            this[field] = fields[field];
        }
        for (const matrix in matrixes) {
            const matrixInstance = this[matrix];
            matrixInstance.__removed_rows__ = [];
            matrixInstance.__rows__ = matrixInstance.getRows().filter(row => matrixes[matrix].rows.find(({rowNr}) => rowNr === row.rowNr));
            matrixInstance.getRows().forEach(row => {
                row.thisFromJson({
                    fields: matrixes[matrix].rows.find(({rowNr}) => rowNr === row.rowNr)
                });
            });
        }
    }

    static async bring(internalId) {
        const queries = [Queries.BRING(this.name, internalId)];
        this.getMatrixes().forEach(matrixClass => {
            const matrixName = matrixClass.name;
            queries.push(Queries.BRING(matrixName, internalId, 'masterId'));
        });
        const con = await this.getMysqlConnection();
        const results = await Promise.all(queries.map(({SQL, PLACEHOLDERS}) => {
            return con.query(SQL, PLACEHOLDERS);
        }));
        const object = {
            fields: {...results[0][0]},
            matrixes: {},
        };
        this.getMatrixes().forEach((matrixClass, inx) => {
            const matrixName = matrixClass.name;
            object.matrixes[matrixName] = {
                removed_rows: [],
                rows: results[inx + 1].map(row => ({...row}))
            };
        });
        con.release();
        return this.fromJson(object);
    }

    static async findAll() {
        const con = await this.getMysqlConnection();
        const res = await con.query(Queries.FIND_ALL(this.name).SQL);
        con.release();
        return res.map(o => this.fromJson({fields: {...o}}));
    }

}

module.exports = BaseRecord.initClass(Description);