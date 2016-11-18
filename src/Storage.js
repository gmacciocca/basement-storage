import Factory from "./Factory";

export default class Storage {
    constructor(dependencies) {
        this._dependencies = dependencies || {};
        this._initialSchemas = this._dependencies["storage.schemas"] || {};
        this._stores = {};
        this._createStoresFromSchemas(this._initialSchemas);
    }

    createStore(storeName, providerNameOrImpl, schema) {
        storeName = this._checkStoreName(storeName);
        const providerImpl = this._getProvider(providerNameOrImpl);
        return (this._stores[storeName] = Factory.createStore(storeName, providerImpl, schema));
    }

    get stores() {
        return this._stores;
    }

    _checkStoreName(storeName) {
        storeName = storeName || "__default";
        if (this._stores[storeName]) {
            throw Factory.createError(`Store named ${storeName} already exists!`);
        }
        return storeName;
    }

    _getProvider(providerNameOrImpl) {
        return typeof providerNameOrImpl === "string" ?
            this._dependencies[providerNameOrImpl] :
            providerNameOrImpl;
    }

    _createStoresFromSchemas(schemas) {
        Object.keys(schemas).forEach(providerName => {
            Object.keys(schemas[providerName]).forEach(storeName => {
                this.createStore(storeName, providerName, schemas[providerName][storeName]);
            });
        });
    }
}
