// At the top of test/index.test.js
const test = require('firebase-functions-test')({
  databaseURL: 'https://medicinedeployer.firebaseio.com',
  storageBucket: 'medicinedeployer.appspot.com',
  projectId: 'medicinedeployer',
}, 'test/medicinedeployer-959ec44eccb6.json');

const myFunctions = require('../index.js');

console.log(myFunctions.updateOrders(null, null));