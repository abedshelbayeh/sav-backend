const express = require("express")

const { boards } = require("../../controllers")

const router = express.Router()

router.get("/list", boards.list)
router.get("/:boardId", boards.getById)
router.get("/templates/list", boards.listTemplates)
router.get("/templates/:templateId", boards.getTemplateById)

router.delete("/:boardId", boards.deleteById)

router.post("/", boards.upsert)

module.exports = router
