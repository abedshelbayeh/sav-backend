const express = require("express")

const authneticationRoute = require("./authentication.routes")
const clientsRoute = require("./clients.routes")
const peopleRoute = require("./people.routes")
const boardsRoute = require("./boards.routes")
const docsRoute = require("./docs.routes")
const fakeRoute = require("./fake.routes")

const config = require("../../config/config")

const auth = require("../../middlewares/auth")

const router = express.Router()

const prodRoutes = [
	{
		path: "/people",
		route: peopleRoute,
		requiredRoles: []
	},
	{
		path: "/boards",
		route: boardsRoute,
		requiredRoles: []
	},
	{
		path: "/clients",
		route: clientsRoute,
		requiredRoles: ["SAV-OPS"]
	},
	{
		path: "/authentication",
		route: authneticationRoute,
		requiredRoles: []
	}
]

prodRoutes.forEach(({ path, route, requiredRoles }) => {
	router.use(path, auth(requiredRoles), route)
})

const devRoutes = [
	{
		path: "/docs",
		route: docsRoute
	},
	{
		path: "/fake",
		route: fakeRoute
	}
]

if (config.env === "development") {
	devRoutes.forEach(({ path, route }) => {
		router.use(path, route)
	})
}

module.exports = router
