const {admin, db} = require('./admin');

module.exports = (request, response, next) =>
{
	let idToken;
	if (
		request.headers.authorization &&
	    request.headers.authorization.startsWith('Bearer ')
	) {
	    idToken = request.headers.authorization.split('Bearer ')[1];
	} else {
	    console.error('No token found');
	    return response.status(403).json({ error: 'Não autorizado' });
	}

	admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      request.user = decodedToken;
      return db.collection('doctors').where('userId', '==', request.user.uid).limit(1).get();
    })
    .then((data) => {
      request.user.login = data.docs[0].data().login;
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return response.status(403).json(err);
    });
};
