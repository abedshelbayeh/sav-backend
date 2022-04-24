const { nanoid } = require("nanoid")
const knex = require("../interfaces/mysql")

const list = async (_clientId, filter, limit, skip) => {
	let qc = knex("boards").where("boards._clientId", _clientId)
	let qd = knex("boards")
		.where("boards._clientId", _clientId)
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

const getById = async (_clientId, boardId) => {
	const rows = await knex
		.select(["participants.*", "templates.*", "boards.*"])
		.from("boards")
		.leftJoin("participants", "boards.id", "participants.boardId")
		.leftJoin("templates", "boards.templateId", "templates.id")
		.where("boards._clientId", _clientId)
		.where("boards.id", boardId)

	return {
		rows
	}
}

const deleteById = async (_clientId, boardId) => {
	const rows = await knex("boards").where("_clientId", _clientId).where("id", boardId).del()

	return {
		rows
	}
}

const upsert = async (_clientId, { id, name, participants, ...rest }) => {
	const boardId = id || nanoid()

	let generatedName
	if (!id) {
		generatedName = `Untitled Board ${new Date().toLocaleDateString()}`
		const existingBoards = await knex
			.select()
			.from("boards")
			.where("_clientId", _clientId)
			.where("name", "like", `%${generatedName}%`)
		generatedName = existingBoards.length ? `${generatedName} #${existingBoards.length + 1}` : generatedName
	}

	let addedParticipants = []
	let deletedParticipants = []
	if (participants) {
		const desiredParticipants = participants.reduce(
			(a, desiredParticipantId) => ({ ...a, [desiredParticipantId]: true }),
			{}
		)
		const existingParticipants = (
			await knex.select().from("participants").where("_clientId", _clientId).where("boardId", boardId)
		).reduce((a, { userId: existingParticipantId }) => ({ ...a, [existingParticipantId]: true }), {})

		addedParticipants = participants.filter((participantId) => !existingParticipants[participantId])
		deletedParticipants = Object.keys(existingParticipants).filter(
			(existingParticipantId) => !desiredParticipants[existingParticipantId]
		)
	}

	await knex.transaction(async (trx) => {
		if (id) {
			await trx("boards")
				.where("_clientId", _clientId)
				.where("id", id)
				.update({ ...rest, name })
		} else {
			await trx("boards").insert({ ...rest, id: boardId, name: generatedName, _clientId })
		}

		if (addedParticipants.length) {
			await trx("participants").insert(
				addedParticipants.map((participantId) => ({ id: nanoid(), boardId, userId: participantId, _clientId }))
			)
		}

		if (deletedParticipants.length) {
			await trx("participants").whereIn("userId", deletedParticipants).where("_clientId", _clientId).del()
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

const listTemplates = async () => {
	const rows = await knex.select().from("templates")

	return {
		rows
	}
}

const getTemplateById = async (templateId) => {
	const rows = await knex.select().from("templates").where("id", templateId)

	return {
		rows
	}
}

module.exports = {
	list,
	getById,
	deleteById,
	upsert,
	listTemplates,
	getTemplateById
}
