const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe('Manage return order of SKU items', () => {
    before(async() => {
        await agent.delete('/api/returnOrder/deleteAll');
        await agent.delete('/api/sku/deleteAll');
        await agent.delete('/api/item/deleteAll');
        await agent.delete('/api/skuitems/deleteAll')
    });
    const skuBody1 = {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }
    const skuBody2 = {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "second SKU",
        price: 10.99,
        availableQuantity: 50
    }
    testPOSTsku(skuBody1);
    testPOSTsku(skuBody2);

    const itemBody1 = {
        id: 1,
        description: "a new item",
        price: 10.99,
        SKUId: 1,
        supplierId: 2
    }
    const itemBody2 = {
        id: 2,
        description: "a new item",
        price: 10.99,
        SKUId: 2,
        supplierId: 2
    }
    testPOSTitem(itemBody1);
    testPOSTitem(itemBody2);

    const skuItemBody1 = {
        RFID: 1,
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30"
    };
    const skuItemBody2 = {
        RFID: 2,
        SKUId: 2,
        DateOfStock: "2021/11/29 12:30"
    }
    testPOSTskuItem(skuItemBody1);
    testPOSTskuItem(skuItemBody2);

    const restockOrderProduct = [{
        SKUId: 1,
        itemId: 1,
        description: "a product",
        price: 10.99,
        qty: 30
    },{
        SKUId: 2,
        itemId: 2,
        description: "another product",
        price: 11.99,
        qty: 20
    }]
    const restockOrderBody = {
        issueDate: "2021/11/29 09:33",
        products: restockOrderProduct,
        supplierId: 1,
    }
    testPOSTrestockOrder(restockOrderBody);


    const returnOrderProduct =[{
        SKUId: 1,
        itemId: 1,
        description: "a product",
        price: 10.99,
        RFID: 1
    }, {
        SKUId: 2,
        itemId: 2,
        description: "another product",
        price: 11.99,
        RFID: 2
    }]
    const returnOrderBody = {
        returnDate: "2021/11/29 09:33",
        products: returnOrderProduct,
        restockOrderId: 1
    }
    testPOSTreturnOrder(returnOrderBody);

    testGETreturnOrder();

})

async function testPOSTsku(skuBody){
    it('creating a new sku', function(done) {
        agent.post("/api/sku")
        .send(skuBody)
        .then(function (res) {
            res.should.have.status(201);
            done();
        })
    })
}

async function testPOSTitem(itemBody){
    it('creating a new item', function(done) {
        agent.post("/api/item")
        .send(itemBody)
        .then(function(res) {
            res.should.have.status(201);
            done();
        })
    })
}

async function testPOSTrestockOrder(roBody) {
    it('creating a new restock order', function(done) {
        agent.post("/api/restockOrder")
        .send(roBody)
        .then(function(res) {
            res.should.have.status(201);
            done();
        })
    })
}

async function testPOSTskuItem(skuitemBody) {
    it('creating a new sku item', function(done) {
        agent.post("/api/skuitem")
        .send(skuitemBody)
        .then(function (res) {
            res.should.have.status(201);
            done();
        })
    })
}

async function testPOSTreturnOrder(returnOrderBody) {
    it('creating a new return order', function(done) {
        agent.post("/api/returnOrder")
        .send(returnOrderBody)
        .then(function(res) {
            res.should.have.status(201);
            done();
        })
    })
}

async function testGETreturnOrder(){
    it('getting the return order as soon as created', function(done) {
        agent.get("/api/returnOrders")
        .then(function(res) {
            res.should.have.status(200);
            done();
        })
    })
}

