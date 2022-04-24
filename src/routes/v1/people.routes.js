const express = require("express")

const { people } = require("../../controllers")

const router = express.Router()

router.get("/list", people.list)

module.exports = router
