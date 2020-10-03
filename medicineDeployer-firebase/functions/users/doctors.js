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
				userId: userId
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
        	}
        	return response.json(userData)
        })
        .catch((err) => {
      		console.error(err);
      		return res.status(500).json({ error: err.code });
   		});
}

exports.updateOrders = (request, response) => {
	let patientData = {};
	let idDocument;
	db.collection('patients').orderBy('name').get()
		.then(data => {
			data.forEach(doc => {
				patientData = doc.data();
				idDocument = doc.id;
				var newOrder;
				var medicationForOrder = [];
				patientData.medication.forEach(medication => {
					var dateNow = new Date();
					if(diff_hours(dateNow, medication.selectedInitialDate) > 0)
					{
						var added_hours = parseInt(medication.periodicity(0,2), 10);
						var added_minutes = parseInt(medication.periodicity(3,5), 10);

						medication.checkpointDate.setHours(medication.checkpointDate.getHours() + added_hours)
						medication.checkpointDate.setMinutes(medication.checkpointDate.getHours() + added_hours)
						

						if(diff_hours(medication.checkpointDate, dateNow) > 0)
						{
							if(diff_hours(dateNow, medication.selectedEndDate) < 0)
							{
								let medication_dic = {};
								medication_dic.name = medication.name;
								medication_dic.id =medication.id;
								medication_dic.selectedInitialDate = medication.selectedInitialDate;
								medication_dic.selectedEndDate = medication.selectedEndDate;
								medication_dic.checkpointDate =	new Date() 
								medication_dic.periodicity = medication.periodicity;
								medication_dic.quantity = medication.quantity;
								medication_dic.unity = medication.unity;
								patientData.medication.push(medication_dic)
								db.collection('/patients').doc(idDocument).update(patientData)

								medicationForOrder.append(medication_dic)
							}
						}
					}
				})
				//!medicationForOrder.isEmpty()
				newOrder = { 
					associated_doctor: patientData.associated_doctor,
					gender:patientData.gender,
					aisle: patientData.aisle,
					bed: patientData.bed,
					name: patientData.name,
					diagnosis: patientData.diagnosis,
					medication: medicationForOrder,
					notifications: patientData.notifications,
					createdAt: new Date().toISOString()
				};

				db.collection('orders').add(newOrder)
				.then(doc => {
					response.json({ message: `${doc.id}`})
				})
				.catch(err => {
					response.status(500).json({error: 'something went wrong'}); //500 internal server error
					console.error(err);
				})
			})
		})
		.catch(err => {
			console.error(err);
		})
}


const diff_hours = (dt2, dt1) => {
	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= (60 * 60);
	return Math.abs(Math.round(diff));
}