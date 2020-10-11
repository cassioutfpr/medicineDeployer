const { admin, db } = require('../util/admin');

exports.initializeNewOrder = (patientId, aisle) => {
    return {
        patientId: patientId,
        aisle: aisle,
        medications: [],
        state: "created",
        createdAt: new Date().toISOString(),
        addMedication,
        saveOrder,
    };
}

function addMedication(medication) {
    this.medications.push(medication);
}

function saveOrder() {
    var newOrder = {
        patientId: this.patientId,
        medications: this.medications,
        state: this.state,
        createdAt: this.createdAt,
    };

    db.collection('orders').add(newOrder)
        .then(doc => {
            console.log('added order');
        })
        .catch(err => {
            console.log(err)
        });
}
