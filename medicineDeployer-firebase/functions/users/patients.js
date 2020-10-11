const { db } = require('../util/admin')

exports.getAllPatients = (request, response) => {
	db.collection('patients').orderBy('name').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			let patients = []; 
			data.forEach(doc => {
				//iterating through array of docs
				patients.push({
					patientId: doc.id, //reference that the doc has. It is not in doc.data()
					aisle: doc.data().aisle, //reference that the doc has. It is not in doc.data()
					name: doc.data().name,
					bed: doc.data().bed,
					date_of_birth: doc.data().date_of_birth,
				});
			});
			return response.json(patients);
		})
		.catch(err => {
			console.error(err);
		})
}

const patient = require("../model/patient");

exports.addOnePatient = (request,response) => {
	response = patient.insertPatient(
		request.user.login,
		request.body.associated_admin,
		request.body.cpf,
		request.body.gender,
		request.body.date_of_birth,
		request.body.aisle,
		request.body.bed,
		request.body.email,
		request.body.city,
		request.body.state,
		request.body.name,
		request.body.score,
		[],
		[]
	);

	return response.status(response);
}

// Delete a patient
exports.deletePatient = (request, response) => {
  	const document = db.doc(`/patients/${request.params.patientId}`);
  	document
    .get()
    .then((doc) => {
		if (!doc.exists) {
			return response.status(404).json({ error: 'Paciente não encontrado.' });
		}

		if (doc.data().associated_doctor !== request.user.login) {
			return response.status(403).json({ error: `Não autorizado. ${doc.data().associated_doctor}  ${request.user.login}` });
		} else {
			return document.delete();
		}
    })
    .then(() => {
    	response.json({ message: 'Paciente deletado com sucesso.' });
    })
    .catch((err) => {
    	console.error(err);
    	return response.status(500).json({ error: err.code });
    });
};

exports.getPatient = (request, response) => {
	let patientData = {};
	db.doc(`/patients/${request.params.patientId}`).get()
		.then(doc => {
			if(!doc.exists){
				return response.status(404).json({error: 'Paciente não encontrado'});
			}
			patientData = doc.data();
			patientData.patientId = doc.id;
			return response.json(patientData);
		})
		.catch(err => {
			console.error(err)
			response.status(500).json({error: err.code});
		})
}

exports.addDiagnosisToPatient = (request, response) => {
	let patientData = {};
	let idDocument;
	var promises = [];

	db.doc(`/patients/${request.params.patientId}`).get()
		.then(doc => {
			if(!doc.exists){
				return response.status(404).json({error: 'Paciente não encontrado'});
			}
			patientData = doc.data();
			idDocument = doc.id;
			request.body.diagnosis.forEach(diagnosisName => {
				db.collection('diagnosis').where('name', '==', diagnosisName).limit(1).get()
				.then(data =>{
					let diagnosis = {};
					diagnosis.name = data.docs[0].data().name;
					diagnosis.id = data.docs[0].data().id;
					patientData.diagnosis.push(diagnosis)
					promises.push(db.collection('/patients').doc(idDocument).update(patientData))
				})
				.catch(err => {
					console.error(err)
					return response.status(500).json({error: err.code});
				})
			})
		})
		.catch(err => {
			console.error(err)
			return response.status(500).json({error: err.code});
		})

	Promise.all(promises)
		.then(data => {
			return response.json({message: 'Diagnóstico adicionado com sucesso'});
		})
		.catch(err => {
			console.error(err)
			return response.status(500).json({error: err.code});
		})
}
//https://medium.com/@aaron_lu1/firebase-cloud-firestore-add-set-update-delete-get-data-6da566513b1b

exports.getAllDiagnosis = (request, response) => {
	db.collection('diagnosis').orderBy('id').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			let diagnosis = []; 
			data.forEach(doc => {
				//iterating through array of docs
				diagnosis.push({
					id: doc.data().id,
					name: doc.data().name,
					explanation: doc.data().explanation,
					associated_medication: doc.data().associated_medication
				});
			});
			return response.json(diagnosis);
		})
		.catch(err => {
			console.error(err);
		})
}

exports.getDiagnosisSearch = (request, response) => {
 	db.collection('diagnosis').where('searchKey', '==' , request.body.searchKey.substring(0, 1).toUpperCase()).get() 
    	.then((data) => {
      		let allSearchedDiagnosis = [];
      		data.forEach(doc =>{
      			allSearchedDiagnosis.push({
      				name: doc.data().name
      			})
      		})
      		return response.json(allSearchedDiagnosis)
    	})
		.catch(err => {
			response.status(500).json({error: err.code});
		})
}

exports.addMedicationToPatient = (request, response) => {
	let patientData = {};
	let idDocument;
	var promises = [];

	db.doc(`/patients/${request.params.patientId}`).get()
		.then(doc => {
			if(!doc.exists){
				return response.status(404).json({error: 'Paciente não encontrado'});
			}
			patientData = doc.data();
			idDocument = doc.id;
			var date_now = new Date()
			date_now.setHours(date_now.getHours() - 24)
			request.body.medication.forEach(medication => {
				db.collection('medication').where('name', '==', medication.name).limit(1).get()
				.then(data =>{
					let medication_dic = {};
					medication_dic.name = data.docs[0].data().name;
					medication_dic.id = data.docs[0].data().id;
					medication_dic.selectedInitialDate = medication.selectedInitialDate;
					medication_dic.selectedEndDate = medication.selectedEndDate;
					medication_dic.checkpointDate =	date_now.toISOString();
					medication_dic.periodicity = medication.periodicity;
					medication_dic.quantity = medication.quantity;
					medication_dic.unity = medication.unity;
					patientData.medication.push(medication_dic)
					promises.push(db.collection('/patients').doc(idDocument).update(patientData))
				})
				.catch(err => {
					console.error(err)
					return response.status(500).json({error: err.code});
				})
			})
		})
		.catch(err => {
			console.error(err)
			return response.status(500).json({error: err.code});
		})

	Promise.all(promises)
		.then(data => {
			return response.json({message: 'Medicamento adicionado com sucesso'});
		})
		.catch(err => {
			console.error(err)
			return response.status(500).json({error: err.code});
		})
}

exports.getAllMedication = (request, response) => {
	db.collection('medication').orderBy('id').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			let medication = []; 
			data.forEach(doc => {
				//iterating through array of docs
				medication.push({
					id: doc.data().id,
					name: doc.data().name,
					associated_diagnosis: doc.data().associated_diagnosis
				});
			});
			return response.json(medication);
		})
		.catch(err => {
			console.error(err);
		})
}

exports.getMedicationSearch = (request, response) => {
 	db.collection('medication').where('searchKey', '==' , request.body.searchKey.substring(0, 1).toUpperCase()).get() 
    	.then((data) => {
      		let allSearchedMedication = [];
      		data.forEach(doc =>{
      			allSearchedMedication.push({
      				name: doc.data().name
      			})
      		})
      		return response.json(allSearchedMedication)
    	})
		.catch(err => {
			response.status(500).json({error: err.code});
		})
}

exports.sendNotification = (request, response) => {
	var promises = [];

	let patientData = {};

	const newNotification = {
		associated_doctor: request.user.login,
		message: request.body.message,
		createdAt: new Date().toISOString(),
		read: false
	}

    for(var prop in request.body.ids) {
        if(!request.body.ids.hasOwnProperty(prop))
            return response.status(404).json({error: 'Escolha um paciente para enviar'});
    }

	request.body.ids.forEach(id => {
		db.doc(`/patients/${id}`).get()
			.then(doc => {
				if(!doc.exists){
					return response.status(404).json({error: 'Paciente não encontrado'});
				}
				patientData = doc.data();
				patientData.notifications.push(newNotification)
				promises.push(db.collection('/patients').doc(doc.id).update(patientData));
			})
			.catch(err => {
				console.error(err)
				return response.status(500).json({error: err.code});
			})
	});

	Promise.all(promises)
		.then(data => {
			return response.json({message: 'Notificação enviada com sucesso'});
		})
		.catch(err => {
			console.error(err)
			return response.status(500).json({error: err.code});
		})
}