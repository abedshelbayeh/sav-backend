const httpStatus = require("http-status")

const catchAsync = require("../utils/catchAsync")
const { people } = require("../services")

const list = catchAsync(async (req, res) => {
	const { _clientId } = req.user
	const { emailAddress, filter, limit, skip } = req.query

	const result = await people.list(_clientId, emailAddress, filter, limit, skip)

	res.status(httpStatus.OK).send(result)
})

module.exports = {
	list
}
