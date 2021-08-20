const Master = require('../base/Master.js');
const BaseMatrix = require('../base/BaseMatrix.js');

const Description = {
    inherits: Master,
    fields: [
        {fieldName: 'Name', type: 'string'},
        {fieldName: 'FantasyName', type: 'string'},
        {fieldName: 'Phone', type: 'integer'},
        {fieldName: 'CustomerGroup', type: 'string'},
        {fieldName: 'Address', type: 'string'},
        {fieldName: 'City', type: 'string', pasteWindow: 'CityPasteWindow', pasteField: 'header1'},
        {fieldName: 'Province', type: 'string', pasteWindow: 'ProvincePasteWindow', pasteField: 'Name'},
        {fieldName: 'Country', type: 'string', pasteWindow: 'CountryPasteWindow', pasteField: 'Name'},
        {fieldName: 'ZipCode', type: 'integer'},
        {fieldName: 'TaxRegType', type: 'integer'},
        {fieldName: 'TaxRegNr', type: 'integer'},
        {fieldName: 'IIBBCondition', type: 'string'},
        {fieldName: 'Office', type: 'string'},
        {fieldName: 'Department', type: 'string'},
        {fieldName: 'PriceDeal', type: 'string'},
        {fieldName: 'SalesGroup', type: 'string'},
        {fieldName: 'Currency', type: 'string'},
        {fieldName: 'Seller', type: 'string'},
        {fieldName: 'ReferedBy', type: 'string'},
        {fieldName: 'FreeDelivery', type: 'string'},
    ],
    matrixes: {
        BaseMatrix
    }
};

class Customer extends Master {

    async check() {
        for (const field of ['Code', 'FantasyName', 'Name']) {
            if (!this[field]) {
                throw new Error('El campo ' + field + ' es obligatorio.');
            }
        }
    }

}

module.exports = Customer.initClass(Description);