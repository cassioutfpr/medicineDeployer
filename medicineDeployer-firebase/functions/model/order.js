const { admin, db } = require('../util/admin');

exports.initializeNewOrder = (aisle) => {
    return {
        aisle: aisle,
        medications: [],
        state: "created",
        createdAt: new Date().toISOString()
    };
}