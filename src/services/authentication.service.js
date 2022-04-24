const httpStatus = require("http-status")

const knex = require("../interfaces/mysql")
const { createTokenWithClaims } = require("../interfaces/firebase")
const ApiError = require("../utils/ApiError")

const authorize = async ({ uid }, impersonator) => {
	const rows = await knex
		.select("users.*", "roles.*", "clients.status as clientStatus")
		.from("users")
		.leftJoin("roles", "users.id", "roles.userId")
		.leftJoin("clients", "users._clientId", "clients.id")
		.where("users.uid", "=", uid)

	if (!rows.length) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"This account isn't fully setup yet. Please contact your administrator for assistance.",
			true
		)
	}

	const [{ name, status, clientStatus }] = rows
	if (status === "SUSPENDED" || clientStatus === "SUSPENDED") {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Your account has been disabled. Contact your administrator for assistance.",
			true
		)
	}

	const claims = rows.reduce((a, { _clientId, userId, role }) => {
		const { roles = [] } = a
		return {
			_clientId,
			userId,
			name,
			roles: [...roles, role]
		}
	}, {})

	if (impersonator) {
		claims.impersonator = impersonator
	}

	return createTokenWithClaims(uid, claims)
}

const impersonate = async ({ uid }, target) => {
	if (!target) {
		throw new ApiError(httpStatus.BAD_REQUEST, "This user is not registered and therefore cannot be impersonated.", true)
	}

	const token = await authorize({ uid: target }, uid)
	return token
}

const endImpersonation = async ({ impersonator }) => {
	const token = await authorize({ uid: impersonator })
	return token
}

module.exports = {
	authorize,
	impersonate,
	endImpersonation
}
