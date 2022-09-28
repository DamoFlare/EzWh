const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe('Manage Positions', () => {
    beforeEach(async() => {
        await agent.delete('/api/position/deleteAll');
    });
    editPosition(200, 10, 10, 10);
})

function editPosition(expectedHTTPStatus, newAisleID, newRow, newCol) {
    it('Modify aisle ID, row and column of P', function(done) {
        // Position P exists
        const body = {
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000
        }
        agent.post('/api/position')
            .send(body)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/positions')
                .then(function(res) {
                    res.should.have.status(200);
                    res.body[0].positionID.should.equal(800234543412);
                    // M selects position P + M defines new aisleID for P + M defines new row for P + M defines new column for P + M confirms the inserted data
                    const body = {
                        newAisleID: newAisleID,
                        newRow: newRow,
                        newCol: newCol
                    }
                    agent.put('/api/position/800234543412')
                        .send(body)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            // Check if everything is ok
                            agent.get('/api/positions')
                                .then(function(res) {
                                    res.should.have.status(200);
                                    res.body[0].positionID.should.equal(800234543412);
                                    res.body[0].row.should.equal(newRow);
                                    res.body[0].col.should.equal(newCol);
                                    res.body[0].aisleID.should.equal(newAisleID);
                                    done();
                                })

                        })
                })
            })
        
    })
}