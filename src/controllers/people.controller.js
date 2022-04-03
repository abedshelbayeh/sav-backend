const httpStatus = require("http-status")
const { faker } = require("@faker-js/faker")
const { v4: uuid } = require("uuid")
const knex = require("../interfaces/mysql")
const catchAsync = require("../utils/catchAsync")
const { peopleService } = require("../services")

const get = catchAsync(async (req, res) => {
	const { filter, limit, skip } = req.query
	const people = await peopleService.get(filter, limit, skip)
	res.status(httpStatus.OK).send(people)
})

const fake = catchAsync(async (req, res) => {
	const { number } = req.query
	const faked = []
	for (let i = 0; i < number; i += 1) {
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
		faked.push({
			id: uuid(),
			name: `${firstName} ${lastName}`,
			email: faker.internet.email(firstName, lastName).toLowerCase()
		})
	}
	const q = knex("users")
	await q.insert(faked)
	res.status(httpStatus.OK).send(faked)
})

module.exports = {
	get,
	fake
}
