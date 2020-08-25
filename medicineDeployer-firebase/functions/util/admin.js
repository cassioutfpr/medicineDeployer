const admin = require('firebase-admin'); //access to the database
admin.initializeApp(); //To use the admin, it's necessary to initialize the app ==> .firebasescr

const db = admin.firestore(); 
module.exports = { admin, db }
