const {mergeWith} = require('lodash');

module.exports = class BaseEntity {

    static __description__ = null;
    static __event_listeners__ = {};

    constructor(){
        // this.__event_listeners__ = {};
    }
    
    static guid () {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    on(eventName, callback) {
        return this.__class__.on(eventName, callback);
    }

    emit(eventName, value) {
        return this.__class__.emit(eventName, value);
    }

    static on(eventName, callback) {
        const id = this.guid();
        const ev = this.__event_listeners__[eventName];
        if (!ev) this.__event_listeners__[eventName] = [];
        this.__event_listeners__[eventName].push({
            id, callback
        });
        return () => {
            this.__event_listeners__[eventName] = this.__event_listeners__[eventName].filter(e => {
                return e.id != id;
            });
        };
    }

    static emit(eventName, value) {
        const evs = this.__event_listeners__[eventName];
        if (Array.isArray(evs)) {
            evs.forEach(ev => {
                ev.callback(value);
            });
        }
    }

    static initClass(Description) {
        if (!Description) this;
        const {inherits} = Description;
        this.__description__ = Description;

        if (inherits) {
            let currentInhertidClass = inherits;
            // eslint-disable-next-line no-constant-condition
            while (true)  {
                const parentDescription = {...currentInhertidClass.getDescription()};
                this.__description__ = mergeWith(parentDescription, this.__description__, (o1, o2) => {
                    if (Array.isArray(o1) && Array.isArray(o2)) {
                        const fns = [];
                        return o1.concat(o2).filter(object => {
                            if (object.fieldName) {
                                if (!fns.includes(object.fieldName)) {
                                    fns.push(object.fieldName);
                                    return true;
                                }
                                return false;
                            }
                            return true;
                        });
                    }
                });
                const currentInhertidClassDescription = currentInhertidClass.getDescription();
                if (currentInhertidClassDescription && currentInhertidClassDescription.inherits) {
                    currentInhertidClass = currentInhertidClassDescription.inherits;
                    continue;
                } else {
                    break;
                }
            }
        }

        this.prototype.__description__ = this.__description__;
        this.prototype.__class__ = this;

        return this;
    }

    static getDescription(){
        return this.__description__;
    }

    getDescription() {
        return this.__class__.__description__;
    }

};