const admin = require("firebase-admin")

const config = require("../config/config")

const app = admin.initializeApp({
	credential: admin.credential.cert(config.firebase.cert)
})
const auth = admin.auth(app)

const verifyToken = (token) => {
	return auth.verifyIdToken(token)
}

const createTokenWithClaims = (uid, claims) => {
	return auth.createCustomToken(uid, claims)
}

module.exports = {
	verifyToken,
	createTokenWithClaims
}
