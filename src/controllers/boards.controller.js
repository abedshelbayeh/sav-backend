const httpStatus = require("http-status")
const catchAsync = require("../utils/catchAsync")
const { boards } = require("../services")

const list = catchAsync(async (req, res) => {
	const { _clientId } = req.user
	const { filter, limit = Infinity, skip = 0 } = req.query

	const result = await boards.list(_clientId, filter, limit, skip)

	res.status(httpStatus.OK).send(result)
})

const getById = catchAsync(async (req, res) => {
	const { _clientId } = req.user
	const { boardId } = req.params

	const result = await boards.getById(_clientId, boardId)

	res.status(httpStatus.OK).send(result)
})

const deleteById = catchAsync(async (req, res) => {
	const { _clientId } = req.user
	const { boardId } = req.params

	const result = await boards.deleteById(_clientId, boardId)

	res.status(httpStatus.OK).send(result)
})

const upsert = catchAsync(async (req, res) => {
	const { _clientId } = req.user

	const payload = req.body
	const result = await boards.upsert(_clientId, payload)

	res.status(httpStatus.OK).send(result)
})

const listTemplates = catchAsync(async (req, res) => {
	const { _clientId } = req.user

	const templates = await boards.listTemplates(_clientId)

	res.status(httpStatus.OK).send(templates)
})

const getTemplateById = catchAsync(async (req, res) => {
	const { _clientId } = req.user
	const { templateId } = req.params

	const templates = await boards.getTemplateById(_clientId, templateId)

	res.status(httpStatus.OK).send(templates)
})

module.exports = {
	list,
	getById,
	deleteById,
	upsert,
	listTemplates,
	getTemplateById
}
