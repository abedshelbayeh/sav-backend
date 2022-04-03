const express = require("express")
const validate = require("../../middlewares/validate")
const { boardsValidation } = require("../../validations")
const { boardsController } = require("../../controllers")

const router = express.Router()

router.get("/list", validate(boardsValidation.getBoards), boardsController.get)
router.get("/:boardId", boardsController.getBoard)
router.delete("/:boardId", validate(boardsValidation.deleteBoard), boardsController.del)
router.post("/", validate(boardsValidation.upsertBoard), boardsController.upsert)

router.get("/templates/list", boardsController.getTemplates)
router.get("/templates/:templateId", boardsController.getTemplate)

module.exports = router
