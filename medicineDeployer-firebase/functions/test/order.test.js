const doctors = require('../users/doctors');
const patient = require('../model/patient');
const assert = require('assert');
const { admin, db } = require('../util/admin');

exports.testUpdateOrders = async () => {
  patientName = 'Cassio123';
  medicationName1 = 'Cloroquina';
  medicationName2 = 'Ozonio';
  startDate = new Date();
  startDate.setMinutes(new Date().getMinutes() - 10);
  endDate = new Date();
  endDate.setHours(24*5);
  periodicity = '0:05';

  createScenario(patientName, medicationName1, medicationName2, startDate, endDate, periodicity);
  await sleep(500);

  doctors.calculateNewOrders();
  await sleep(500);

  assertOrderCorrectlyCreated(medicationName1, medicationName2);
  cleanTest(patientName);
}

function createScenario(patientName, medicationName1, medicationName2, startDate, endDate, periodicity) {
  const medications = [];
  const medication1 = {};
  const medication2 = {};

  medication1.name = medicationName1;
  medication1.selectedInitialDate = startDate.toISOString();
  medication1.selectedEndDate = endDate.toISOString();
  medication1.checkpointDate = startDate.toISOString();
  medication1.periodicity = periodicity;

  medication2.name = medicationName2;
  medication2.selectedInitialDate = startDate.toISOString();
  medication2.selectedEndDate = endDate.toISOString();
  medication2.checkpointDate = startDate.toISOString();
  medication2.periodicity = periodicity;

  medications.push(medication1);
  medications.push(medication2);

  patient.insertPatient(
      'a',
      'a',
      '01234567890',
      'male',
      '1995-05-01',
      'Green',
      '2',
      'null@null.com',
      'Curitiba',
      'PR',
      patientName,
      1,
      'Coronga',
      medications
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function assertOrderCorrectlyCreated(medicationName1, medicationName2) {
  db.collection('patients').where('name', '==', patientName).get()
      .then(patients => {
        patientDoc = patients.docs[0].ref;

        db.collection('orders').where('patientId', '==', patientDoc.id).get()
            .then(orders => {
              assert.equal(orders.docs[0].data().medications[0].name, medicationName1);
              assert.equal(orders.docs[0].data().medications[1].name, medicationName2);
            });
      });
}

function cleanTest(patientName) {
  db.collection('patients').where('name', '==', patientName).get()
      .then(patients => {
        patientDoc = patients.docs[0].ref;

        db.collection('orders').where('patientId', '==', patientDoc.id).get()
            .then(orders => {
              orders.docs[0].ref.delete();
            });

        patientDoc.delete();
      });
}
