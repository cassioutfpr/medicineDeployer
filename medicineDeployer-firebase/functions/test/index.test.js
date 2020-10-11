// At the top of test/index.test.js
const test = require('firebase-functions-test')({
  databaseURL: 'https://medicinedeployer.firebaseio.com',
  storageBucket: 'medicinedeployer.appspot.com',
  projectId: 'medicinedeployer',
}, 'test/medicinedeployer-959ec44eccb6.json');

const { admin, db } = require('../util/admin');
const orderTest = require('./order.test');

orderTest.testUpdateOrders();
