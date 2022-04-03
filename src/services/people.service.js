const knex = require("../interfaces/mysql")

const get = async (filter, limit, skip) => {
	let q = knex("users").orderBy("name", "asc")
	if (filter) {
		q = q.where("name", "like", `%${filter}%`)
	}

	const [rowsCount = [], rows = []] = await Promise.all([q.clone().count(), q.select().offset(skip).limit(limit)])
	const [{ "count(*)": count } = {}] = rowsCount

	return {
		rows,
		count
	}
}

module.exports = {
	get
}
