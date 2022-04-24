const { faker } = require("@faker-js/faker")
const { nanoid } = require("nanoid")
const httpStatus = require("http-status")

const catchAsync = require("../utils/catchAsync")
const knex = require("../interfaces/mysql")

const people = catchAsync(async (req, res) => {
	const { number = 10, clientId } = req.query

	const faked = []
	for (let i = 0; i < number; i += 1) {
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
		faked.push({
			_clientId: clientId,
			id: nanoid(),
			name: `${firstName} ${lastName}`,
			email: faker.internet.email(firstName, lastName).toLowerCase()
		})
	}

	const q = knex("users")
	await q.insert(faked)

	res.status(httpStatus.OK).send(faked)
})

module.exports = {
	people
}
