import Store from "../src/Store";
import MockProvider from "./support/MockProvider";

describe("Store", function() {
    beforeEach(() => {
        this.name = "storeName";
        this.schema = {};
        this.provider = new MockProvider();
        this.store = new Store(this.name, this.provider, this.schema);
    });

    it("implements interface", () => {
        this.store.should.have.property("name");
        this.store.should.respondTo("has");
        this.store.should.respondTo("get");
        this.store.should.respondTo("set");
        this.store.should.respondTo("remove");
        this.store.should.respondTo("clear");
    });

    describe("When storing a value", () => {
        beforeEach(() => {
            this.value1 = { valueKey1: "value1" };
            this.store.set("key1", this.value1);
        });

        it("is present in the store successfully", () => {
            this.store.has("key1").should.equal(true);
        });
        it("it can be read back", () => {
            this.store.get("key1").should.deep.equal(this.value1);
        });
        it("it is read back as a different entity", () => {
            this.store.get("key1").should.not.equal(this.value1);
        });

        describe("After being modified", () => {
            beforeEach(() => {
                this.value2 = { valueKey2: "value2" };
                this.value1and2 = Object.assign({}, this.value1);
                this.value1and2 = Object.assign(this.value1and2, this.value2);
                this.store.set("key1", this.value2);
            });

            it("it can be read back modified", () => {
                this.store.get("key1").should.deep.equal(this.value1and2);
            });
        });

        describe("After being removed", () => {
            beforeEach(() => {
                this.store.remove("key1");
            });

            it("it is gone from the store", () => {
                this.store.has("key1").should.equal(false);
            });

            it("it cannot be read back", () => {
                expect(this.store.get("key1")).to.equal(null);
            });
        });
    });

    describe("When storing multiple values", () => {
        beforeEach(() => {
            this.values = [
                { a: 1 },
                { b: 2 },
                { c: 3 },
                { d: 4 }
            ];

            this.forEachCallback = chai.spy();

            this.store.set("key1", this.values[0]);
            this.store.set("key2", this.values[1]);
            this.store.set("key3", this.values[2]);
            this.store.set("key4", this.values[3]);
        });
        it("is possibe to get their count", () => {
            this.store.length.should.equal(4);
        });
        it("is possibe to go through all of them", () => {
            this.store.forEach(this.forEachCallback);
            this.forEachCallback.should.have.been.called.exactly(4);
        });
        it("their values are correct", () => {
            this.store.forEach(value => {
                const index = this.values.findIndex(element => JSON.stringify(element) === JSON.stringify(value));
                index.should.not.equal(-1);
                this.values.splice(index, 1);
            });
        });

        describe("After clearing the store", () => {
            beforeEach(() => {
                this.store.clear();
            });

            it("it has no values stored", () => {
                this.store.length.should.equal(0);
            });
        });
    });
});
