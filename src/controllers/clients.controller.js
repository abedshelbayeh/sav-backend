const httpStatus = require("http-status")
const catchAsync = require("../utils/catchAsync")
const { clients } = require("../services")

const list = catchAsync(async (req, res) => {
	const { name, filter, limit = Infinity, skip = 0 } = req.query

	const result = await clients.list(name, filter, limit, skip)

	res.status(httpStatus.OK).send(result)
})

const getById = catchAsync(async (req, res) => {
	const { clientId } = req.params

	const result = await clients.getById(clientId)

	res.status(httpStatus.OK).send(result)
})

const deleteById = catchAsync(async (req, res) => {
	const { clientId } = req.params

	const result = await clients.deleteById(clientId)

	res.status(httpStatus.OK).send(result)
})

const onboard = catchAsync(async (req, res) => {
	const payload = req.body

	const result = await clients.onboard(payload)

	res.status(httpStatus.OK).send(result)
})

const update = catchAsync(async (req, res) => {
	const payload = req.body
	const { clientId } = req.params

	const result = await clients.update({ id: clientId, ...payload })

	res.status(httpStatus.OK).send(result)
})

module.exports = {
	list,
	getById,
	deleteById,
	onboard,
	update
}
