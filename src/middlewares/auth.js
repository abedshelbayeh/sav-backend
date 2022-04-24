const httpStatus = require("http-status")

const { verifyToken } = require("../interfaces/firebase")

const authorize = (requiredRoles) => async (req, res, next) => {
	try {
		const { "x-sav-user": token } = req.headers
		const { _clientId } = req.query

		const user = await verifyToken(token)
		const { roles = [] } = user

		if (roles.includes("SAV-OPS") && _clientId) {
			user._clientId = _clientId
		}

		const isAuthorized = requiredRoles.every((requiredRole) => roles.includes(requiredRole))
		if (!isAuthorized) {
			return res.status(httpStatus.FORBIDDEN).send({
				status: "FORBIDDEN",
				message: "You don't have the required roles to access this endpoint."
			})
		}

		req.user = user
		next()
	} catch (error) {
		return res.status(httpStatus.FORBIDDEN).send({
			status: "FORBIDDEN",
			message: "Authorization is required to access this endpoint."
		})
	}
}

module.exports = authorize
