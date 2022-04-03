const app = require("./app")
const config = require("./config/config")
const logger = require("./config/logger")

const server = app.listen(config.port, () => {
	logger.info(`listening on port ${config.port}`)
})

const handleExit = () => {
	if (server) {
		server.close(() => {
			logger.info("server is closed")
			process.exit(1)
		})
	} else {
		process.exit(1)
	}
}

const handleUnexpectedError = (error) => {
	logger.error(error)
	handleExit()
}

process.on("uncaughtException", handleUnexpectedError)
process.on("unhandledRejection", handleUnexpectedError)

process.on("SIGTERM", () => {
	logger.info("SIGTERM received")
	if (server) {
		server.close()
	}
})
