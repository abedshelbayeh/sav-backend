const knex = require("../interfaces/mysql")

const get = async (filter, limit, skip) => {
	let q = knex("users").orderBy("name", "asc")
	if (filter) {
		q = q.where("name", "like", `%${filter}%`)
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
	get
}
