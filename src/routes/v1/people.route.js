const express = require("express")
const validate = require("../../middlewares/validate")
const peopleValidation = require("../../validations/people.validation")
const peopleController = require("../../controllers/people.controller")

const router = express.Router()

router.get("/list", validate(peopleValidation.getPeople), peopleController.get)
router.post("/fake", peopleController.fake)

module.exports = router
