const express = require("express")

const { clients } = require("../../controllers")

const router = express.Router()

router.get("/list", clients.list)
router.get("/:clientId", clients.getById)

router.post("/onboard", clients.onboard)
router.post("/:clientId", clients.update)

router.delete("/:clientId", clients.deleteById)

module.exports = router
