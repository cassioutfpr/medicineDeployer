const { db } = require('../util/admin')

exports.getSentOrders = (request, response) => {
	db.collection('orders').get()
		.then(data => {
			//data is a querySnapshot witch has docs in it
			let orders = []; 
			data.forEach(doc => {
				//iterating through array of docs
				if(doc.data().state === 'sent_from_pharmaceutical')
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

exports.deliveringOrder = (request, response) => {
	var orderId = request.params.id
	db.doc(`/orders/${orderId}`).get()
		.then(doc => {
			if(!doc.exists){
				return response.status(404).json({error: 'Pedido não encontrado'});
			}
			orderData = doc.data();
			orderData.state = 'delivering'
			db.collection('/orders').doc(orderId).update(orderData)
				.then(data => {
					return response.json({message: 'Pedido atualizado com sucesso'});
				})
				.catch(err => {
					console.error(err)
					response.status(500).json({error: err.code});
				})
		})
		.catch(err => {
			console.error(err)
			response.status(500).json({error: err.code});
		})
}

exports.orderDelivered = (request, response) => {
	var orderId = request.params.id
	db.doc(`/orders/${orderId}`).get()
		.then(doc => {
			if(!doc.exists){
				return response.status(404).json({error: 'Pedido não encontrado'});
			}
			orderData = doc.data();
			orderData.state = 'delivered'
			orderData.nurse = request.body.nurse
			orderData.deliveredAt = request.body.deliveredAt
			db.collection('/orders').doc(orderId).update(orderData)
				.then(data => {
					return response.json({message: 'Pedido atualizado com sucesso'});
				})
				.catch(err => {
					console.error(err)
					response.status(500).json({error: err.code});
				})
		})
		.catch(err => {
			console.error(err)
			response.status(500).json({error: err.code});
		})
}