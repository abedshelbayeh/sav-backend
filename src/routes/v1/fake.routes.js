const express = require("express")

const { fake } = require("../../controllers")

const router = express.Router()

router.get("/people", fake.people)

module.exports = router
