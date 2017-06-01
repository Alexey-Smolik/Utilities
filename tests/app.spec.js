'use strict'
var app = require("../index");
const request = require("supertest")(app);


const cookies =
    ['token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNDk1MzgyNDYwfQ.GqwBkeyGLrur1OUDBgq0bR9y4fal08quxaIsBX2WDSc; role = 1'];
var userId, utilityId, statisticId, payStatisticsId;


describe('users api tests', () => {
    describe('POST api/users', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .post('/api/users')
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var wrongData = {firstName: "test1", lastName: "test1", email: "test1", password: "123"};
        var addData = {firstName: "test1", lastName: "test1", email: "test1@test.com", password: "123"};

        it('should response with error if wrong data', () => {
            return request
                .post('/api/users')
                .set('Cookie', cookies)
                .send(wrongData)
                .expect(501)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        it('should add new user', () => {
            return request
                .post('/api/users')
                .set('Cookie', cookies)
                .send(addData)
                .expect(201)
                .then(res => {
                    userId = res.body.userId;
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('GET api/users', () => {
        it('should show all users', () => {
            return request
                .get('/api/users')
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });



    describe('PUT api/users', () => {
        var updateData = {name: "test", surname: "test", email: "test@test.com", role: "2"};
        it('should change user description', () => {
            return request
                .put('/api/users/' + userId)
                .set('Cookie', cookies)
                .send(updateData)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('GET api/users/:id', () => {
        it('should show one user', () => {
            return request
                .get('/api/users/' + userId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });


    describe('POST api/users/:id', () => {
        var wrongRole = {role: "3"};
        var role = {role: "1"};

        it('should response with error if role > 2 and < 1', () => {
            return request
                .post('/api/users/' + userId)
                .set('Cookie', cookies)
                .send(wrongRole)
                .expect(403)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        it('should change user role', () => {
            return request
                .post('/api/users/' + userId)
                .set('Cookie', cookies)
                .send(role)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('DELETE api/users', () => {
        it('should delete user', () => {
            return request
                .delete('/api/users/' + userId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });
});




describe('utilities api tests', () => {
    describe('POST api/utility', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .post('/api/utility')
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var utility = {name: "test"};
        it('should add new utility', () => {
            return request
                .post('/api/utility')
                .set('Cookie', cookies)
                .send(utility)
                .expect(201)
                .then(res => {
                    utilityId = res.body.utilityId;
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('GET api/utility', () => {
        it('should show all utilities', () => {
            return request
                .get('/api/utility')
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });

    describe('PUT api/utility/:id', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .put('/api/utility/' + userId)
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var updateUtility = {name: "test2"};
        it('should change utility name', () => {
            return request
                .put('/api/utility/' + userId)
                .set('Cookie', cookies)
                .send(updateUtility)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('DELETE api/utility', () => {
        it('should delete utility', () => {
            return request
                .delete('/api/utility/' + utilityId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });
});




describe('statistics api tests', () => {
    describe('POST api/statistics', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .post('/api/statistics')
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var statistics = {UserId: 11, UtilityId: 1};
        it('should add new statistics', () => {
            return request
                .post('/api/statistics')
                .set('Cookie', cookies)
                .send(statistics)
                .expect(201)
                .then(res => {
                    statisticId = res.body.statisticId;
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('GET api/statistics', () => {
        it('should show all statistics', () => {
            return request
                .get('/api/statistics')
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });

    describe('PUT api/statistics/:id', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .put('/api/statistics/' + statisticId)
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var statistics = {arrear: 999};
        it('should add arrear', () => {
            return request
                .put('/api/statistics/' + statisticId)
                .set('Cookie', cookies)
                .send(statistics)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });

    describe('GET api/statistics/:id', () => {
        it('should show one user', () => {
            return request
                .get('/api/statistics/' + statisticId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });

    describe('DELETE api/statistics', () => {
        it('should delete statistics', () => {
            return request
                .delete('/api/statistics/' + statisticId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });
});

describe('payments api tests', () => {
    describe('PUT api/payments/:id', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .put('/api/payments/12')
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var wrongPayment = {amount: 1, cardNumber: 'x'};
        it('should response with error if the card number is not correct', () => {
            return request
                .put('/api/payments/12')
                .set('Cookie', cookies)
                .send(wrongPayment)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var payment = {amount: 1, cardNumber: 1};
        it('should add payment', () => {
            return request
                .put('/api/payments/12')
                .set('Cookie', cookies)
                .send(payment)
                .expect(201)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });
});

describe('payStatistics api tests', () => {
    describe('POST api/payStatistics', () => {
        it('should response with error if passed wrong params', () => {
            return request
                .post('/api/payStatistic')
                .set('Cookie', cookies)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                    expect(res.body.message).toBeDefined();
                })
        });

        var wrongPayStatistics = {UtilityId: 0, UserId: 0, amount: 1000};
        var addPayStatistics = {UtilityId: 1, UserId: 11, amount: 999};

        it('should response with error if wrong data', () => {
            return request
                .post('/api/payStatistic')
                .set('Cookie', cookies)
                .send(wrongPayStatistics)
                .expect(400)
                .then(res => {
                    expect(res.body.status).toBe('error');
                })
        });

        it('should add new pay statistic', () => {
            return request
                .post('/api/payStatistic')
                .set('Cookie', cookies)
                .send(addPayStatistics)
                .expect(201)
                .then(res => {
                    payStatisticsId = res.body.payStatisticsId;
                    expect(res.body.status).toBe('success');
                })
        });

    });

    describe('GET api/payStatistics', () => {
        it('should show all pay statistics', () => {
            return request
                .get('/api/payStatistic')
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });

    describe('GET api/payStatistics/:id', () => {
        it('should show one pay statistic', () => {
            return request
                .get('/api/payStatistic/' + payStatisticsId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        });
    });

    describe('DELETE api/payStatistics', () => {
        it('should delete pay statistic', () => {
            return request
                .delete('/api/payStatistic/' + payStatisticsId)
                .set('Cookie', cookies)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe('success');
                })
        });
    });
});