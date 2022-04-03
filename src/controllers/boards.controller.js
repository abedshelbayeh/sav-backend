const httpStatus = require("http-status")
const catchAsync = require("../utils/catchAsync")
const { boardsService } = require("../services")

const get = catchAsync(async (req, res) => {
	const { filter, limit = Infinity, skip = 0 } = req.query
	const boards = await boardsService.get(filter, limit, skip)
	res.status(httpStatus.OK).send(boards)
})

const getBoard = catchAsync(async (req, res) => {
	const { boardId } = req.params
	const boards = await boardsService.getBoard(boardId)
	res.status(httpStatus.OK).send(boards)
})

const del = catchAsync(async (req, res) => {
	const { boardId } = req.params
	const affectedRows = await boardsService.del(boardId)
	res.status(httpStatus.OK).send(affectedRows)
})

const upsert = catchAsync(async (req, res) => {
	const payload = req.body
	const boards = await boardsService.upsert(payload)
	res.status(httpStatus.OK).send(boards)
})

const getTemplates = catchAsync(async (req, res) => {
	const templates = await boardsService.getTemplates()
	res.status(httpStatus.OK).send(templates)
})

const getTemplate = catchAsync(async (req, res) => {
	const { templateId } = req.params
	const templates = await boardsService.getTemplate(templateId)
	res.status(httpStatus.OK).send(templates)
})

module.exports = {
	get,
	getBoard,
	del,
	upsert,
	getTemplates,
	getTemplate
}
