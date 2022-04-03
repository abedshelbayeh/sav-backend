const Joi = require("joi")

const getPeople = {
	query: Joi.object().keys({
		filter: Joi.string().allow(""),
		limit: Joi.number().allow(null),
		skip: Joi.number().allow(null)
	})
}

module.exports = {
	getPeople
}
