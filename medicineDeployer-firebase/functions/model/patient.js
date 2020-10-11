const { admin, db } = require('../util/admin');
const { validateAddPatientData } = require('../util/validators')

exports.insertPatient = (
    associated_doctor,
    associated_admin,
    cpf,
    gender,
    date_of_birth,
    aisle,
    bed,
    email,
    city,
    state,
    name,
    score,
    diagnosis,
    medication
) => {
    const newPatient = {
        associated_doctor: associated_doctor,
        associated_admin: associated_admin,
        cpf: cpf,
        gender: gender,
        date_of_birth: date_of_birth,
        aisle: aisle,
        bed: bed,
        email: email,
        city: city,
        state: state,
        name: name,
        score: score,
        diagnosis: diagnosis,
        medication: medication,
        notifications: [{
            associated_doctor: associated_doctor,
            createdAt: new Date().toISOString(),
            message: `${name} adicionado por ${associated_doctor}`,
            read: false
        }],
        createdAt: new Date().toISOString()
    };

    const { valid, errors } = validateAddPatientData(newPatient);

    if(!valid) return 400;

    db.collection('patients').add(newPatient)
        .then(doc => {
            return 200
        })
        .catch(err => {
            return 500
        })
}
