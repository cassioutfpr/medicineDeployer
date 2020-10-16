const { admin, db } = require('../util/admin');

const firebaseConfig = require('../util/config');

const cors = require('cors')({origin: true});

//initializaing firebase to use signup the users
const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

const { validateSignUpData, validateLoginData } = require('../util/validators')

exports.signupDoctor = (request, response) => {
	const newUser = {
		email: request.body.email,
		password: request.body.password,
		confirmPassword: request.body.confirmPassword,
		login: request.body.login,
		crm: request.body.crm,
		cpf: request.body.cpf,
		profession: request.body.profession,
		hospital: request.body.hospital,
	};

	const { valid, errors } = validateSignUpData(newUser); 

	if(!valid){
		return response.status(400).json(errors)
	}

	//validating data and authenticanting
	let token, userId;
	db.doc(`/doctors/${newUser.email}`).get()
		.then(doc => { //from get()
			if(doc.exists){
				return response.status(400).json({crm: 'Este email já foi utilizado'});
			}else{
				return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
			}
		})
		.then(data => { //from createUserWithEmailAndPassword()
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then(idToken => { //from getTokenId()
			token = idToken;
			const userCredentials = {
				login: newUser.login,
				crm: newUser.crm,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				cpf: newUser.cpf,
				profession: newUser.profession,
				hospital: newUser.hospital,
				userId: userId,
				associated_admin: request.body.associated_admin
			};
			//https://firebase.google.com/docs/firestore/manage-data/add-data
			return db.doc(`/doctors/${newUser.login}`).set(userCredentials) ;
		})
		.then(() => { //from set()
			return response.status(201).json({token});
		})
		.catch(err => {
			console.error(err);
			if(err.code === "auth/email-already-in-use"){
				return response.status(400).json({email: 'Email já foi utilizado'});
			}else{
			    return response.status(500).json({error: err.code});
			}
		})
}

exports.loginDoctor =  (request, response) => {
	cors(request, response, () => {});
	response.header("Access-Control-Allow-Origin", "firestore.googleapis.com");
	response.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, OPTIONS");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	response.header("Access-Control-Allow-Credentials", true);
	const user = {
		email: request.body.email,
		password: request.body.password
	};

	const { valid, errors } = validateLoginData(user); 

	if(!valid) return response.status(400).json(errors)

	//response.set('Access-Control-Allow-Origin', '*');
	firebase.auth().signInWithEmailAndPassword(user.email, user.password)
		.then(data => {
			return data.user.getIdToken();
		})
		.then(token => { //from getTokenId()
			return response.json({token});
		})
		.catch(err => {
			console.error(err);
			if(err.code === "auth/user-not-found" ){
				return response.status(403).json({general: 'Credenciais erradas. Por favor, tente novamente'});
			}else if(err.code === "auth/wrong-password" ){
				return response.status(403).json({general: 'Credenciais erradas. Por favor, tente novamente'});
			}
			return response.status(500).json({error: err.code});	
		})

}

exports.doctorCredentials = (request, response) => {
	let userData = {};
  	db.doc(`/doctors/${request.user.login}`).get()
  		.then((doc) => {
      		if (doc.exists) {
        		userData.credentials = doc.data().login;
        		userData.profession = doc.data().profession;
        		userData.hospital = doc.data().hospital;
        	}
        	return response.json(userData)
        })
        .catch((err) => {
      		console.error(err);
      		return res.status(500).json({ error: err.code });
   		});
}

const order = require("../model/order");

exports.updateOrders = (request, response) => {
	calculateNewOrders();
	return response.json({ message: 'Updated'});
}

exports.calculateNewOrders = () => {
	let ordersPerPatient = [];

	db.collection('patients').orderBy('name').get()
		.then(patients => {
			patients.forEach(patient => {
				var patientMedications = [];

				patient.data().medication.forEach(medication => {
					if(!shouldAddMedicationToOrder(medication)) {
						patientMedications.push(medication);
						return;
					}

					var patientId = patient.id;

					if(!(patientId in ordersPerPatient)) {
						ordersPerPatient[patientId] = order.initializeNewOrder(patientId, patient.data().aisle);
					}

					ordersPerPatient[patientId].addMedication(medication);
					patientMedications.push(updateCheckpoint(medication));
				})

				updatePatientData(patient, patientMedications);
			})

			for(var index in ordersPerPatient) {
				ordersPerPatient[index].saveOrder();
			}
		})
		.catch(err => {
			console.error(err);
		});
}

function shouldAddMedicationToOrder(medication) {
	var dateNow = new Date();
	var medicationDate = new Date(medication.selectedInitialDate);
	var medicationEndDate = new Date(medication.selectedEndDate);
	var added_hours = parseInt(medication.periodicity.slice(0,2), 10);
	var added_minutes = parseInt(medication.periodicity.slice(3,5), 10);
	var checkpointDate = new Date(medication.checkpointDate);

	checkpointDate.setHours(checkpointDate.getHours() + added_hours);
	checkpointDate.setMinutes(checkpointDate.getMinutes() + added_minutes);

	return dateNow >= medicationDate && dateNow <= medicationEndDate && checkpointDate <= dateNow;
}

function updateCheckpoint(medication) {
	medication.checkpointDate = (new Date()).toISOString();
	return medication;
}

function updatePatientData(patient, patientMedications) {
	var patientData = patient.data();
	patientData.medication = patientMedications;

	db.collection('/patients').doc(patient.id).update(patientData)
		.then(doc => {
			console.log('atualizou patient')
		})
		.catch(err => {
			console.error(err);
		});
}

exports.getAllOrders = (request, response) => {
	db.collection('orders').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			let orders = []; 
			data.forEach(doc => {
				//iterating through array of docs
				if(doc.data().state === 'created')
				{
					orders.push({
						orderId: doc.id, //reference that the doc has. It is not in doc.data()
						aisle: doc.data().aisle, //reference that the doc has. It is not in doc.data()
						name: doc.data().name,
						bed: doc.data().bed,
						associated_doctor: doc.data().associated_doctor,
						gender:doc.data().gender,
						aisle: doc.data().aisle,
						bed: doc.data().bed,
						diagnosis: doc.data().diagnosis,
						medication: doc.data().medication,
						notifications: doc.data().notifications,
					});
				}
			});
			return response.json(orders);
		})
		.catch(err => {
			console.error(err);
		})
}

exports.orderSentFromPharmaceutical = (request, response) => {
	var orderId = request.params.id
	db.doc(`/orders/${orderId}`).get()
		.then(doc => {
			if(!doc.exists){
				return response.status(404).json({error: 'Pedido não encontrado'});
			}
			orderData = doc.data();
			orderData.state = 'sent_from_pharmaceutical'
			let quantity_sub;
			let quantity_add;
            request.body.medication[0].forEach((medication) => (
				db.collection('medication').where('name', '==', medication.name).limit(1).get()
					.then(data =>{
						quantity_sub = parseInt(data.docs[0].data().quantity_left, 10) - parseInt(medication.quantity, 10)
						quantity_add = parseInt(data.docs[0].data().quantity_used, 10) + parseInt(medication.quantity, 10)
						db.collection("medication").doc(data.docs[0].id).update({quantity_left: quantity_sub, quantity_used: quantity_add})
					})
					.catch(err => {
						return response.status(500).json({error: err.code});
					})
			)) 
			return db.collection('/orders').doc(orderId).update(orderData)
		})
		.then(data => {
			return response.json({message: 'Pedido atualizado com sucesso'});
		})
		.catch(err => {
			console.error(err)
			response.status(500).json({error: err.code});
		})
}