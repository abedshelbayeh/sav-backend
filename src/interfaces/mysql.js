const Knex = require("knex")
const config = require("../config/config")

const { host, port, user, password } = config.database
const knex = Knex({
	client: "mysql",
	connection: {
		host,
		port,
		user,
		password,
		database: "sor"
	}
})

module.exports = knex
