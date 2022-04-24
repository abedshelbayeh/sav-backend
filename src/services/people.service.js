const knex = require("../interfaces/mysql")

const list = async (_clientId, emailAddress, filter, limit, skip) => {
	let q = knex("users").where("_clientId", _clientId).orderBy("name", "asc")
	if (filter) {
		q = q.where("name", "like", `%${filter}%`)
	}

	if (emailAddress) {
		q = q.where("email", "=", emailAddress)
	}

	const qc = q.clone()
	if (limit > 0) {
		q = q.offset(skip).limit(limit)
	}

	const [rowsCount = [], rows = []] = await Promise.all([qc.count(), q.select()])
	const [{ "count(*)": count } = {}] = rowsCount

	return {
		rows,
		count
	}
}

module.exports = {
	list
}
