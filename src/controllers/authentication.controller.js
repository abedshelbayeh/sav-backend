const httpStatus = require("http-status")

const catchAsync = require("../utils/catchAsync")
const { authentication } = require("../services")

const authorize = catchAsync(async (req, res) => {
	const { user } = req

	const token = await authentication.authorize(user)

	res.status(httpStatus.OK).send({ token })
})

const impersonate = catchAsync(async (req, res) => {
	const { user } = req
	const { target } = req.body

	const token = await authentication.impersonate(user, target)

	res.status(httpStatus.OK).send({ token })
})

const endImpersonation = catchAsync(async (req, res) => {
	const { user } = req

	const token = await authentication.endImpersonation(user)

	res.status(httpStatus.OK).send({ token })
})

module.exports = {
	authorize,
	impersonate,
	endImpersonation
}
