const express = require("express")

const { authentication } = require("../../controllers")

const router = express.Router()

router.post("/", authentication.authorize)
router.post("/impersonation/start", authentication.impersonate)
router.post("/impersonation/end", authentication.endImpersonation)

module.exports = router
