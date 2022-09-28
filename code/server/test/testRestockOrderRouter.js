const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);


describe('Creating, edit, retrieve and delete restock order', () => {
    beforeEach(async() => {
        await agent.delete("/api/restockOrder/deleteAll")
    })
    POSTandPUTandGETtest(201, 200, 200)
})
async function POSTandPUTandGETtest(expectedHTTPStatus1, expectedHTTPStatus2, expectedHTTPStatus3) {
    it('Creating, edit and retrieve restock order', function(done) {
        //Creating new restock order
            // Creating skus
            const skuBody1 = {
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "first SKU",
                price: 10.99,
                availableQuantity: 50
            }
            agent.post("/api/sku")
            .send(skuBody1)
            .then(function(res) {
                res.should.have.status(201);
                const skuBody2 = {
                    description: "a new sku",
                    weight: 100,
                    volume: 50,
                    notes: "second SKU",
                    price: 10.99,
                    availableQuantity: 50
                }
                agent.post("/api/sku")
                .send(skuBody2)
                .then(function(res) {
                    res.should.have.status(201);
                    // Creating Items
                    const itemBody1 = {
                        id: 1,
                        description: "a new item",
                        price: 10.99,
                        SKUId: 1,
                        supplierId: 2
                    }
                    agent.post("/api/item")
                    .send(itemBody1)
                    .then(function(res) {
                        res.should.have.status(201);
                        const itemBody2 = {
                            id: 2,
                            description: "a new item",
                            price: 10.99,
                            SKUId: 2,
                            supplierId: 2
                        }
                        agent.post("/api/item")
                        .send(itemBody2)
                        .then(function(res) {
                            res.should.have.status(201);
                            // Creating restock order
                            const product = [{
                             SKUId: 1,
                             itemId: 1,
                             description: "a product",
                             price: 10.99,
                             qty: 30   
                            }, {
                                SKUId: 2,
                                itemId: 2,
                                description: "another product",
                                price: 11.99,
                                qty: 20
                            }];
                            const roBody = {
                                issueDate: "2021/11/29 09:33",
                                products: product,
                                supplierId: 2
                            }
                            agent.post("/api/restockOrder")
                            .send(roBody)
                            .then(function(res) {
                                res.should.have.status(expectedHTTPStatus1)
                                // Retrieving restock order as soon as created
                                agent.get("/api/restockOrders")
                                .then(function(res) {
                                    console.log('testrestockorder')
                                    console.log(res.body)
                                    res.should.have.status(expectedHTTPStatus2);
                                    res.body[0].id.should.equal(1);
                                    res.body[0].state.should.equal("ISSUED");
                                    //res.body[0].products[0].SKUId.should.equal(1);
                                    // Editing state of restock order
                                    const roBody2 = {
                                        newState: "DELIVERY"
                                    }
                                    agent.put("/api/restockOrder/1")
                                    .send(roBody2)
                                    .then(function(res) {
                                        res.should.have.status(expectedHTTPStatus3)
                                        done();
                                    })
                                })
                            })
                        })   
                    })
                })
            })

    })
}
