const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);




    describe('Create user and define rights', () => {
    
        beforeEach(async() => {
            await agent.delete('/api/users/allUsers');
        });
        newUser(201, 'clerk@gmail.com', 'testpassword', 'clerk', 'signor', 'clerk');
        getUser(200, 'clerk@gmail.com', 'testpassword', 'clerk', 'signor', 'clerk');
        
    })
    
    describe('Modify user rights', ()  => {
    
        beforeEach(async() => {
            await agent.delete('/api/users/allUsers');
        });
        editUser(201, 'customer', 'clerk', 'clerk@gmail.com', 'testpassword', 'clerk', 'signor', 'clerk');
    
    })
    
    describe('Login user with role clerk', () => {
        beforeEach(async() => {
            await agent.delete('/api/users/allUsers');
        });
        login(201, 'clerk@mail.com', 'prova', 'clerk', 'damiano', 'ferla');
    
    })









function newUser(expectedHTTPStatus, username, password, role, name, surname) {
    it('Create user', function (done) {
        if (username !== undefined) {
            const user = { username: username, password: password, type: role, name: name, surname: surname}
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/newUser') 
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}


function getUser(expectedHTTPStatus, username, password, name, surname, role) {
    it('getting user data from the system', function (done) {
        const user = { username: username, password: password, type: role, name: name, surname: surname}
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].email.should.equal(username);
                        r.body[0].name.should.equal(name);
                        r.body[0].surname.should.equal(surname);
                        r.body[0].type.should.equal(role);
                        done();
                    });
            });
    });
}

function editUser(expectedHTTPStatus, newType, oldType, username, password, role, name, surname){
    it('edit user rights', function(done) {
        const params = username;
        const body = {newType: newType, oldType: oldType}
        const user = { username: username, password: password, type: role, name: name, surname: surname}
        agent.post('/api/newUser')
            .send(user)
            .then(function(res) {
                res.should.have.status(201);
                agent.put('/api/users/'+params)
                    .send(body)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        agent.get('/api/users')
                            .then(function(r) {
                                r.should.have.status(200);
                                r.body[0].email.should.equal(username);
                                r.body[0].type.should.equal(newType);
                                done();
                            });
                    });
            });
    });
}

function login(expectedHTTPStatus, username, password, role, name, surname){
    it('login clerk', function(done) {
        const user = { username: username, password: password, type: role, name: name, surname: surname}
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                const body = {username: username, password: password};
                agent.post('/api/clerkSessions')
                    .send(body)
                    .then(function(res) {
                        res.should.have.status(expectedHTTPStatus);
                        res.body.username.should.equal(username);
                        done();
                    })
            })
    })
}

