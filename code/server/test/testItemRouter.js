const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe('test GET and DELETE on ITEM', () => {
    beforeEach(async() => {
        await agent.delete("/api/items/deleteAll");
    })
    testGETandDELETE(200, 204);
})

async function testGETandDELETE(expectedHTTPStatus1, expectedHTTPStatus2) {
    it('Create new item, retrieving it and finally delete it', function(done) {
        // Creating new item
            // Creating new sku
        const skuBody = {
            description: "a sku description",
            weight: 100,
            volume: 50,
            notes: "first sku",
            price: 10.99,
            availableQuantity: 50
        }
         agent.post("/api/sku")
            .send(skuBody)
            .then(function(res) {
                res.should.have.status(201);
                // Creating new item
                const itemBody = {
                    id: 1,
                    description: "a new item",
                    price: 10.99,
                    SKUId: 1,
                    supplierId: 2
                }
                agent.post("/api/item")
                    .send(itemBody)
                    .then(function(res) {
                        res.should.have.status(201);
                        // Retrieving the item
                          agent.get("/api/items")
                            .then(function(res) {
                                res.should.have.status(expectedHTTPStatus1);
                                res.body[0].id.should.equal(1);
                                // Delete the item
                                 agent.delete("/api/items/1/2")
                                    .then(function(res) {
                                        res.should.have.status(expectedHTTPStatus2);
                                        done();
                                    })
                            })
                    })
            })
    })
}