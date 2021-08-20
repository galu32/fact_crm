const BaseRecord = require('./BaseRecord.js');

const Description = {
    inherits: BaseRecord,
    fields: [
        {fieldName: 'Code', type: 'string'},
    ]
};

class Master extends BaseRecord {

    async check() {
        for (const field of ['Code', 'FantasyName', 'Name']) {
            if (!this[field]) {
                throw new Error('El campo ' + field + ' es obligatorio.');
            }
        }
    }

}

module.exports = Master.initClass(Description);