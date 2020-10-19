const { admin, db } = require('../util/admin');

exports.initializeNewOrder = (name, aisle, hospital, notifications, diagnosis, associated_doctor) => {
    return {
        name: name,
        aisle: aisle,
        medication: [],
        notifications: notifications,
        diagnosis: diagnosis,
        state: "created",
        createdAt: new Date().toISOString(),
        hospital: hospital,
        addMedication,
        saveOrder,
        nurse: "",
        deliveredAt: "",
        associated_doctor: associated_doctor
    };
}

function addMedication(medication) {
    this.medication.push(medication);
}

function saveOrder() {
    var newOrder = {
        name: this.name,
        medication: this.medication,
        state: this.state,
        createdAt: this.createdAt,
        aisle: this.aisle,
        hospital: this.hospital,
        notifications: this.notifications,
        diagnosis: this.diagnosis,
        associated_doctor: this.associated_doctor,
        nurse: "",
        deliveredAt: "",
    };

    db.collection('orders').add(newOrder)
        .then(doc => {
            console.log('added order');
        })
        .catch(err => {
            console.log('salvou orderopaoaopaoapopa')
            console.log(err)
        });
}
