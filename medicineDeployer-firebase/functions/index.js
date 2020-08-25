const functions = require('firebase-functions'); //access to firebase functions

const  express = require('express'); //express helps to access the same route using get/post 
// without having to deal with each one separately 
const app = express();

const cors = require('cors')({origin: true});

const { getAllPatients, addOnePatient, deletePatient, getPatient, 
		addDiagnosisToPatient, addMedicationToPatient, getAllDiagnosis,
		getAllMedication, getDiagnosisSearch, 
		getMedicationSearch } = require('./users/patients')
const { signupDoctor, loginDoctor, doctorCredentials } = require('./users/doctors')

const FBAuth = require('./util/fbAuth');

//getting colletion documents from http get  ===> https://firebase.google.com/docs/firestore/query-data/get-data
app.get('/patients', getAllPatients);
app.get('/patients/:patientId', getPatient);
app.get('/allDiagnosis', getAllDiagnosis);
app.get('/allMedication', getAllMedication);
app.post('/getDiagnosisSearch', getDiagnosisSearch);
app.post('/getMedicationSearch', getMedicationSearch);

//adding colletion documents from http post
//To use express post() method with 3 arguments => the second one can prevent from being executed (middleware)
//https://expressjs.com/en/guide/using-middleware.html
app.post('/patients', FBAuth,addOnePatient);
app.delete('/patients/:patientId', FBAuth, deletePatient);
app.post('/patients/addDiagnosis/:patientId', FBAuth, addDiagnosisToPatient);
app.post('/patients/addMedication/:patientId', FBAuth, addMedicationToPatient);

//Doctor credentials 
app.get('/doctor', FBAuth, doctorCredentials)

//Signup routine
app.post('/signupDoctor', signupDoctor);

//Login routine
app.post('/loginDoctor', loginDoctor);

app.use(cors);

exports.api = functions.https.onRequest(app); //binding app to api
//functions.region('southamerica-east1') does not work