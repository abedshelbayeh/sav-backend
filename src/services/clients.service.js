const { nanoid } = require("nanoid")
const knex = require("../interfaces/mysql")

const list = async (name, filter, limit, skip) => {
	let qc = knex("clients").where("clients.id", "<>", "SAV-OPS")
	let qd = knex("clients")
		.where("clients.id", "<>", "SAV-OPS")
		.leftJoin("users", "clients.id", "users._clientId")
		.groupBy("clients.id")
		.offset(skip)
		.limit(limit)

	if (name) {
		qc = qc.where("clients.name", "=", name)
		qd = qd.where("clients.name", "=", name)
	}

	if (filter) {
		qc = qc.where("clients.name", "like", `%${filter}%`)
		qd = qd.where("clients.name", "like", `%${filter}%`)
	}

	const [rowsCount = [], rows = []] = await Promise.all([
		qc.count(),
		qd.select("clients.*").count("users.id", { as: "activeUsers" })
	])
	const [{ "count(*)": count } = {}] = rowsCount

	return {
		rows,
		count
	}
}

const getById = async (clientId) => {
	const rows = await knex.select().from("clients").where("clients.id", clientId)

	return {
		rows
	}
}

const deleteById = async (clientId) => {
	const rows = await knex("clients").where("id", clientId).del()

	return {
		rows
	}
}

const onboard = async ({ name: clientName, admin: { name: adminName, email } }) => {
	const clientId = nanoid()
	const adminId = nanoid()

	await knex.transaction(async (trx) => {
		await trx("clients").insert({ id: clientId, name: clientName, status: "ACTIVE" })
		await trx("users").insert({ _clientId: clientId, id: adminId, name: adminName, email })
		await trx("roles").insert({ _clientId: clientId, id: nanoid(), userId: adminId, role: "ADMIN" })
	})

	return {
		rows: [
			{
				id: clientId
			}
		]
	}
}

const update = async ({ id, ...rest }) => {
	const rows = await knex("clients").where("id", id).update(rest)

	return {
		rows
	}
}

module.exports = {
	list,
	getById,
	deleteById,
	onboard,
	update
}
