const { v4: uuid } = require("uuid")
const knex = require("../interfaces/mysql")

const get = async (filter, limit, skip) => {
	let qc = knex("boards")
	let qd = knex("boards")
		.leftJoin("templates", "boards.templateId", "templates.id")
		.leftJoin("participants", "boards.id", "participants.boardId")
		.groupBy("boards.id")
		.offset(skip)
		.limit(limit)

	if (filter) {
		qc = qc.where("boards.name", "like", `%${filter}%`)
		qd = qd.where("boards.name", "like", `%${filter}%`)
	}

	const [rowsCount = [], rows = []] = await Promise.all([
		qc.count(),
		qd.select(["boards.*", "templates.name as templateName"]).count("participants.id", { as: "numberOfParticipants" })
	])
	const [{ "count(*)": count } = {}] = rowsCount

	return {
		rows,
		count
	}
}

const getBoard = async (boardId) => {
	const rows = await knex
		.select(["participants.*", "templates.*", "boards.*"])
		.from("boards")
		.leftJoin("participants", "boards.id", "participants.boardId")
		.leftJoin("templates", "boards.templateId", "templates.id")
		.where("boards.id", boardId)

	return {
		rows,
		count: rows.length
	}
}

const del = async (boardId) => {
	const affectedRows = await knex("boards").where("id", boardId).del()

	return {
		affectedRows
	}
}

const upsert = async ({ id, name, participants, ...rest }) => {
	const boardId = id || uuid()

	let generatedName
	if (!id) {
		generatedName = `Untitled Board ${new Date().toLocaleDateString()}`
		const existingBoards = await knex("boards").where("name", "like", `%${generatedName}%`).select()
		generatedName = existingBoards.length ? `${generatedName} #${existingBoards.length + 1}` : generatedName
	}

	let added = []
	let deleted = []
	if (participants) {
		const desiredParticipants = participants.reduce(
			(a, desiredParticipantId) => ({ ...a, [desiredParticipantId]: true }),
			{}
		)
		const existingParticipants = (await knex("participants").select().where("boardId", boardId)).reduce(
			(a, { userId: existingParticipantId }) => ({ ...a, [existingParticipantId]: true }),
			{}
		)

		added = participants.filter((participantId) => !existingParticipants[participantId])
		deleted = Object.keys(existingParticipants).filter(
			(existingParticipantId) => !desiredParticipants[existingParticipantId]
		)
	}

	await knex.transaction(async (trx) => {
		if (id) {
			await trx("boards")
				.where("id", id)
				.update({ ...rest, name })
		} else {
			await trx("boards").insert({ ...rest, id: boardId, name: generatedName })
		}

		if (added.length) {
			await trx("participants").insert(added.map((participantId) => ({ id: uuid(), boardId, userId: participantId })))
		}

		if (deleted.length) {
			await trx("participants").whereIn("userId", deleted).del()
		}
	})

	return {
		rows: [
			{
				id: boardId
			}
		]
	}
}

const getTemplates = async () => {
	const rows = await knex("templates").select()

	return {
		rows
	}
}

const getTemplate = async (templateId) => {
	const rows = await knex("templates").where("id", templateId).select()

	return {
		rows
	}
}

module.exports = {
	get,
	getBoard,
	del,
	upsert,
	getTemplates,
	getTemplate
}
