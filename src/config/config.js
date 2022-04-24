const dotenv = require("dotenv")
const path = require("path")
const Joi = require("joi")

dotenv.config({ path: path.join(__dirname, "../../.env") })

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid("production", "development", "test").required(),
		PORT: Joi.number().default(8080),
		DATABASE_HOST: Joi.string().required(),
		DATABASE_PORT: Joi.number().required(),
		DATABASE_USER: Joi.string().required(),
		DATABASE_PASSWORD: Joi.string().required(),
		FIREBASE_CERT: Joi.string().required()
	})
	.unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env)

if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	database: {
		host: envVars.DATABASE_HOST,
		port: envVars.DATABASE_PORT,
		user: envVars.DATABASE_USER,
		password: envVars.DATABASE_PASSWORD
	},
	firebase: {
		cert: JSON.parse(envVars.FIREBASE_CERT)
	}
}
