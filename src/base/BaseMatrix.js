const BaseRecord = require('./BaseRecord.js');

const Description = {
    inherits: BaseRecord,
    fields: [
        {fieldName: 'masterId', type: 'integer'},
        {fieldName: 'rowNr', type: 'integer'},
    ]
};

class BaseMatrix extends BaseRecord {

    constructor(...args) {
        super(...args);
        this.__rows__ = [];
        this.__removed_rows__ = [];
        this.__parent_class__ = null;
    }

    pasteParentMasterId() {
        this.getRows().forEach(row => row.masterId = this.__parent_class__.internalId);
    }

    setIsModified(value) {
        this.__parent_class__?.setIsModified(value);
        return super.setIsModified(value);
    }

    getRows() {
        return this.__rows__;
    }

    getRemovedRows() {
        return this.__removed_rows__;
    }

    addRow() {
        const self = new this.__class__();
        this.__parent_class__.setIsModified(true);
        self.masterId = this.__parent_class__.internalId;
        self.__parent_class__ = this.__parent_class__;
        this.__rows__.push(self);
        this.reDoRowNrs();
        return self;
    }

    reDoRowNrs() {
        this.__rows__.forEach((row, index) => {
            row.rowNr = index + 1;
        });
    }

    removeRow(ix) {
        this.__parent_class__.setIsModified(true);
        const row = this.__rows__[ix];
        if (row.internalId) {
            this.__removed_rows__.push(row);
        }
        this.__rows__.splice(ix, 1);
        this.reDoRowNrs();
    }

    getRow(ix) {
        return this.__rows__[ix];
    }

    setParentRecord(cls) {
        this.__parent_class__ = cls;
    }

}

module.exports = BaseMatrix.initClass(Description);