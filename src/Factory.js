import Store from "./Store";

export default class Factory {
    static createError(...args) {
        return new Error(...args);
    }
    static createStore(...args) {
        return new Store(...args);
    }
}
