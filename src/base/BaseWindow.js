import BaseEntity from './BaseEntity.js';
import axios from 'axios';

const Description = {
    record: '',
    title: '',
    initialTab: '',
    header: [
    ],
    tabs: {
    },
    matrixes: {
    }
};

class BaseWindow extends BaseEntity {

    static __record__ = null;
    static __rest_client__ = axios.create({
    });

    static setRecord(record) {
        this.__record__ = record;
    }

    static getRecord() {
        return this.__record__;
    }

    static getHeaderFields(){
        const {header} = this.getDescription();
        if (header && Object.keys(header).length){
            return header;
        }    
        return [];
    }

    static getFieldsForTab(tabName){
        const {tabs} = this.getDescription();
        if (tabs && Array.isArray(tabs[tabName])){
            return tabs[tabName];
        }
        return [];
    }

    static getFieldsForMatrix(matrixName){
        const {matrixes} = this.getDescription();
        if (matrixes && Array.isArray(matrixes[matrixName])) {
            return matrixes[matrixName];
        }
        return [];
    }

    static getTabNameByIndex(index) {
        const {tabs} = this.getDescription();
        if (tabs && Object.keys(tabs).length > 0){
            return Object.keys(tabs)[index];
        }
        return '';
    }

    static isMatrix(tabName) {
        const {matrixes} = this.getDescription();
        return matrixes && matrixes[tabName];
    }

    static async fieldIsEditable(/* fieldName */) {
        return true;
    }

    static async canDeleteRow(/* matrixName, row, index */) {
        return true;
    }

    static async canAddRow(/* matrixName */) {
        return true;
    }

    static async getPasteWindowRows(/*pasteWindow*/) {
        return [];
    }

    static async save() {
        const {data: {ok, record, error}} = await this.__rest_client__.post(`/api/record/save/${this.getDescription().record}`, {
            ...this.__record__.toJson()
        });
        if (ok) this.__record__.thisFromJson(record);
        return {ok, error};
    }

    static async bring(internalId, recordClass) {
        if (!internalId || internalId == 0) return new recordClass();
        const {data} = await this.__rest_client__.get(`/api/record/bring/${this.getDescription().record}/${internalId}`);
        return recordClass.fromJson(data);
    }

    static emitWindowReload() {
        return this.emit(`WINDOWRELOAD::${this.getDescription().record}`, null);
    }

    static onWindowReload(callback) {
        return this.on(`WINDOWRELOAD::${this.getDescription().record}`, callback);
    }

    static async reload() {
        const record = await this.bring(this.__record__.internalId, this.__record__.__class__);
        this.__record__.thisFromJson(record.toJson());
        this.emitWindowReload();
    }

    static async getListWindowRows() {
        return [];
    }

    static getListWindowHeaders() {
        return [];
    }

    static async findMany() {
        const {data} = await this.__rest_client__.get('/api/record/all/' + this.getDescription().record);
        return data;
    }

    static getTitle() {
        return `${this.__record__.name()} #${this.__record__.Code || ''}`;
    }

}
export default BaseWindow.initClass(Description);