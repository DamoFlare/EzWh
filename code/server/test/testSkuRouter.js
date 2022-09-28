const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe('Manage SKUs', () => {
    beforeEach(async() => {
        await agent.delete('/api/sku/deleteAll');
    });
    editSku(200, 10, 10);

})


function editSku(expectedHTTPStatus, weight, volume) {
    it('Modify SKU weight and volume', function(done) {
        const body =  {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }; 
        agent.post('/api/sku')
            .send(body)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skus/1')
                .then(function(res) {
                    res.should.have.status(200);
                    res.body[0].id.should.equal(1);
                    const body = {
                        newWeight: weight,
                        newVolume: volume,
                    }      
                    agent.put('/api/sku/1')
                        .send(body)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            agent.get('/api/skus/1')
                            .then(function (res) {
                                res.should.have.status(200);
                                res.body[0].weight.should.equal(weight);
                                res.body[0].volume.should.equal(volume);
                                done();
                            })                       
                        })                
                })            
            })    
    })
}



