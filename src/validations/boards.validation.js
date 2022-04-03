const Joi = require("joi")

const getBoards = {
	query: Joi.object().keys({
		filter: Joi.string().allow("", null),
		boardId: Joi.string().allow("", null),
		limit: Joi.number().allow(null),
		skip: Joi.number().allow(null)
	})
}

const deleteBoard = {
	params: Joi.object()
		.keys({
			boardId: Joi.string().required()
		})
		.required()
}

const upsertBoard = {
	body: Joi.object()
		.keys({
			id: Joi.string().allow(null),
			templateId: Joi.string(),
			name: Joi.string(),
			participants: Joi.array().items(Joi.string())
		})
		.required()
}

module.exports = {
	getBoards,
	deleteBoard,
	upsertBoard
}
