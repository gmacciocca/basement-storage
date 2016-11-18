import { Storage } from "../src";
import Factory from "../src/Factory";

describe("Storage", function() {
    beforeEach(() => {
        this.storeFactory = chai.spy((name, provider, schema) => { return { testName: name, testSchema: schema, testProvider: provider }; });
        Factory.createStore = this.storeFactory;
        this.dependencies = {
            provider1: { who: "iAmProvider1" },
            provider2: { who: "iAmProvider2" }
        };
        this.storage = new Storage(this.dependencies);
    });

    it("implements interface", () => {
        this.storage.should.respondTo("createStore");
        this.storage.should.have.property("stores");
    });

    describe("Creating initial stores", () => {
        beforeEach(() => {
            this.schemas = {
                "provider1" : {
                    "store11": ["field111", "field112"],
                    "store12": ["field121", "field122"]
                },
                "provider2": {
                    "store21": ["field211", "field212"],
                    "store22": ["field221", "field222"]
                }
            };
            this.dependencies["storage.schemas"] = this.schemas;
            this.storage = new Storage(this.dependencies);
        });

        it("creates stores from initial schemas passed in constructor", () => {
            this.storeFactory.should.have.been.called.exactly(4);

            this.storage.stores.should.have.property("store11");
            this.storage.stores.should.have.property("store12");
            this.storage.stores.should.have.property("store21");
            this.storage.stores.should.have.property("store22");

            this.storage.stores.store11.testName.should.equal("store11");
            this.storage.stores.store12.testName.should.equal("store12");
            this.storage.stores.store21.testName.should.equal("store21");
            this.storage.stores.store22.testName.should.equal("store22");
        });

        it("creates stores from initial schemas with correct provider", () => {
            this.storage.stores.store11.testProvider.who.should.equal("iAmProvider1");
            this.storage.stores.store12.testProvider.who.should.equal("iAmProvider1");
            this.storage.stores.store21.testProvider.who.should.equal("iAmProvider2");
            this.storage.stores.store22.testProvider.who.should.equal("iAmProvider2");
        });
    });

    describe("Dynamic store creation", () => {
        beforeEach(() => {
            this.storage = new Storage(this.dependencies);

            this.dynStoreSchema = ["field111", "field112"];
            this.dynStore1Provider = { who: "iAmProvider3" },

            this.storage.createStore("dynStore1", this.dynStore1Provider, this.dynStoreSchema);
            this.storage.createStore("dynStore2", this.dynStore1Provider, this.dynStoreSchema);
            this.storage.createStore("dynStore3", "provider1", this.dynStoreSchema);
        });
        it("creates stores via createStore method", () => {
            this.storeFactory.should.have.been.called.exactly(3);

            this.storage.stores.should.have.property("dynStore1");
            this.storage.stores.should.have.property("dynStore2");
            this.storage.stores.should.have.property("dynStore3");

            this.storage.stores.dynStore1.testName.should.equal("dynStore1");
            this.storage.stores.dynStore2.testName.should.equal("dynStore2");
            this.storage.stores.dynStore3.testName.should.equal("dynStore3");
        });

        it("creates stores via createStore method with correct provider", () => {
            this.storage.stores.dynStore1.testProvider.who.should.equal("iAmProvider3");
            this.storage.stores.dynStore2.testProvider.who.should.equal("iAmProvider3");
            this.storage.stores.dynStore3.testProvider.who.should.equal("iAmProvider1");
        });
    });

    describe("Duplicate store creation", () => {
        beforeEach(() => {
            this.storage = new Storage(this.dependencies);

            this.dynStoreSchema = ["field0", "field1"];

            this.storage.createStore("dynStore0", "provider1", this.dynStoreSchema);
            this.storage.createStore("dynStore1", "provider1", this.dynStoreSchema);
            try {
                this.storage.createStore("dynStore0", "provider1", this.dynStoreSchema);
            } catch (err) {
                this.createStoreError = err;
            }
        });

        it("should throw error when creating duplicate store name", () => {
            expect(this.createStoreError).to.be.an.instanceof(Error);
        });

        it("creates stores via createStore method", () => {
            this.storeFactory.should.have.been.called.exactly(2);

            this.storage.stores.should.have.property("dynStore0");
            this.storage.stores.should.have.property("dynStore1");

            this.storage.stores.dynStore0.testName.should.equal("dynStore0");
            this.storage.stores.dynStore1.testName.should.equal("dynStore1");
        });

        it("creates stores via createStore method with correct provider", () => {
            this.storage.stores.dynStore0.testProvider.who.should.equal("iAmProvider1");
            this.storage.stores.dynStore1.testProvider.who.should.equal("iAmProvider1");
        });
    });

});
