
export default class Store {
    constructor(name, provider/* TODO: , schema*/) {
        this._provider = provider;
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get length() {
        return this._provider.length;
    }

    forEach(func) {
        this._getAllKeys().forEach(fullKey => func(this._get(fullKey)));
    }

    has(key) {
        return null !== this.get(key);
    }

    get(key) {
        return this._get(this._makeFullKey(key));
    }

    set(key, values) {
        this._provider.setItem(this._makeFullKey(key), this._mergeValues(this.get(key) || {}, values));
    }

    remove(key) {
        return this._remove(this._makeFullKey(key));
    }

    clear() {
        this._getAllKeys().forEach(fullKey => this._remove(fullKey));
    }

    _get(fullKey) {
        try {
            return JSON.parse(this._provider.getItem(fullKey));
        } catch (err) {
            //console.error(err); // eslint-disable-line no-console
        }
        return null;
    }

    _remove(fullKey) {
        return this._provider.removeItem(fullKey);
    }

    _mergeValues(oldValues, newValues) {
        return JSON.stringify(Object.assign(oldValues, newValues));
    }

    _makeFullKey(key) {
        return this._name ? `${this._name}_##${key}` : `${key}`;
    }

    _isOwnKey(fullKey) {
        return fullKey.startsWith(`${this._name}_##`);
    }

    _getAllKeys() {
        const fullKeys = [];
        for (var i = 0; i < this._provider.length; i++) {
            const fullKey = this._provider.key(i);
            this._isOwnKey(fullKey) ? fullKeys.push(fullKey) : "";
        }
        return fullKeys;
    }

}
