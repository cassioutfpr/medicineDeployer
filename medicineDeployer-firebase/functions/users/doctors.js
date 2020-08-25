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