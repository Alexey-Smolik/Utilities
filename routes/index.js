const routes = require('express').Router({mergeParams: true});
const user = require('./user');
const session = require('./session');
const statistics = require('./statistics');
const utility = require('./utility');
const payments = require('./payments');
const payStatistic = require('./payStatistics');
const auth = require('../middlewares/auth');

//const domains = require('./domains');
//const payments = require('./payments');
//const auth = require('../middlewares/auth');
//const format = require('../middlewares/format');

//routes.use(format);
routes.use('/session', session);
routes.use('/users', user);
routes.use(auth);
routes.use('/statistics', statistics);
routes.use('/utility', utility);
routes.use('/payments', payments);
routes.use('/payStatistic', payStatistic);
//routes.use(auth);
//routes.use('/domains', domains);
//routes.use('/payments', payments);

module.exports = routes;