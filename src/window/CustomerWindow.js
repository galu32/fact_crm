import BaseWindow from '../base/BaseWindow.js';

const Description = {
    record: 'Customer',
    title: 'Cliente',
    pluralTitle: 'Clientes',
    initialTab: 'Delivery',
    header: [
        {fieldName: 'Code', type: 'string'},
        {fieldName: 'Name', type: 'string'},
        {fieldName: 'FantasyName', type: 'string'},
        {fieldName: 'Phone', type: 'integer'}
    ],
    tabs: {
        Detail: [
            {fieldName: 'CustomerGroup', type: 'string'}
        ],
        Delivery: [
            {fieldName: 'Address', type: 'string'},
            {fieldName: 'City', type: 'string', pasteWindow: 'CityPasteWindow', pasteField: 'header1'},
            {fieldName: 'Province', type: 'string', pasteWindow: 'ProvincePasteWindow', pasteField: 'Name'},
            {fieldName: 'Country', type: 'string', pasteWindow: 'CountryPasteWindow', pasteField: 'Name'},
            {fieldName: 'ZipCode', type: 'integer'},
        ],
        Legal: [
            {fieldName: 'TaxRegType', type: 'integer'},
            {fieldName: 'TaxRegNr', type: 'integer'},
            {fieldName: 'IIBBCondition', type: 'string'},
        ],
        Comercial: [
            {fieldName: 'Office', type: 'string'},
            {fieldName: 'Department', type: 'string'},
            {fieldName: 'PriceDeal', type: 'string'},
            {fieldName: 'SalesGroup', type: 'string'},
            {fieldName: 'Currency', type: 'string'},
            {fieldName: 'Seller', type: 'string'},
            {fieldName: 'ReferedBy', type: 'string'},
            {fieldName: 'FreeDelivery', type: 'string'},
        ]
    },
    matrixes: {
        BaseMatrix: [
            {fieldName: 'masterId', type: 'integer'},
            {fieldName: 'CreationDate', type: 'string'},
            {fieldName: 'CreationUser', type: 'string'},
            {fieldName: 'internalId', type: 'integer'},
            {fieldName: 'rowNr', type: 'integer'},
        ]
    }
};

class CustomerWindow extends BaseWindow {

    static async getPasteWindowRows(pasteWindow) {
        switch(pasteWindow) {
        case 'ProvincePasteWindow':
            return import('../snapshots/Pronvice')
                .then(({default: def}) => def);
        case 'CountryPasteWindow':
            return import('../snapshots/Country')
                .then(({default: def}) => def);
        default:
            return super.getPasteWindowRows(pasteWindow);
        }
    }

    static getListWindowHeaders() {
        return ['internalId', 'Code', 'Name', 'FantasyName'];
    }

    static async getListWindowRows() {
        return (await this.findMany()).map(row => {
            return row.fields;
        });
    }
    
}
export default CustomerWindow.initClass(Description);