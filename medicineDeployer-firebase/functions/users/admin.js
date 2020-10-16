const { db } = require('../util/admin')
const { validateAddMedicationData } = require('../util/validators')

exports.getDeliveredOrders = (request, response) => {
	db.collection('orders').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			let orders = []; 
			data.forEach(doc => {
				//iterating through array of docs
				if(doc.data().state === 'delivered')
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

exports.addOneMedication = (request,response) => {
	//console.log('fdfijsd')
	//response.json({ message: 'opafoi'})
	const newMedication = { 
		associated_admin: request.body.associated_admin,
		quantity: request.body.quantity,
		quantity_left: request.body.quantity,
		quantity_used: 0,
		unity: request.body.unity,
		hospital: request.body.hospital,
		name: request.body.name.substring(0, 1).toUpperCase() + request.body.name.substring(1).toLowerCase(),
		searchKey: request.body.name.substring(0, 1).toUpperCase()
	};

	const { valid, errors } = validateAddMedicationData(newMedication); 

	if(!valid) return response.status(400).json(errors)

	db.collection('medication').add(newMedication)
		.then(doc => {
			response.json({ message: `${doc.id}`})
		})
		.catch(err => {
			response.status(500).json({error: 'something went wrong'}); //500 internal server error
			console.error(err);
		})
}

exports.getAllMedication = (request, response) => {
	db.collection('medication').orderBy('name').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			var medication = []; 
			data.forEach(doc => {
				//iterating through array of docs
				medication.push({
					medicationId: doc.id,
					name: doc.data().name,
					quantity_left: doc.data().quantity_left,
					quantity_used: doc.data().quantity_used,
				});
			});
			return response.json(medication);
		})
		.catch(err => {
			console.error(err);
		})
}

exports.updateMedicationQuantity = (request, response) => {
	var medicationId = request.params.id
	const cityRef = db.collection('medication').doc(medicationId);

	cityRef.update({quantity_left: request.body.quantity})
	.then(data => {
			return response.json({ message: 'Atualizado com sucesso'})
		})
		.catch(err => {
			return response.status(500).json({error: err.code});
		})
}

/*
exports.addOneMedication = (request,response) => {
	//console.log('fdfijsd')
	//response.json({ message: 'opafoi'})
	var alreadyExists;
	const newMedication = { 
		associated_admin: request.body.associated_admin,
		quantity: request.body.quantity,
		quantity_left: request.body.quantity,
		quantity_used: 0,
		unity: request.body.unity,
		hospital: request.body.hospital,
		name: request.body.name.substring(0, 1).toUpperCase() + request.body.name.substring(1).toLowerCase(),
		searchKey: request.body.name.substring(0, 1).toUpperCase()
	};

 	db.collection('medication').where('name', '==' , newMedication.name).limit(1).get() 
		.then((data) => {
	  		errors = {};
	  		if(isEmpty(data))
	  		{
	  			console.log('opa2')
	  		}
	  		else
	  		{
	  			console.log('opa3')
	  		}
	  		errors.name = 'Medicamento já existente'
	  		return response.status(400).json(errors)	
		})
		.catch(err => {
			alreadyExists = false

			const { valid, errors } = validateAddMedicationData(newMedication); 

			if(!valid) return response.status(400).json(errors)

			db.collection('medication').add(newMedication)
				.then(doc => {
					response.json({ message: `${doc.id}`})
				})
				.catch(err => {
					response.status(500).json({error: 'something went wrong'}); //500 internal server error
					console.error(err);
				})
		})
}

*/