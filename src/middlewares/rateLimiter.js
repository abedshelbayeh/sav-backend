const rateLimit = require("express-rate-limit")

const checkoutLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	skipSuccessfulRequests: true
})

module.exports = {
	checkoutLimiter
}
