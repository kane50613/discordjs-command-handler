const Interaction = require("../Base/Interaction")
const InteractionHandler = require("../handler/InteractionHandler")
const path = require('path')
const fs = require("fs")
const EventEmitter = require("events").EventEmitter

class InteractionManager extends EventEmitter {

	constructor(bot, options) {
		super()

		this.interactions = new Map()
		this.bot = bot

		bot.on("ready", () => this.init(bot, options))
	}

	async init(bot, options) {
		this.interactions.forEach(c => this._createCommand(c))

		bot.ws.on("INTERACTION_CREATE", async (interaction) => {
			let executor = this.interactions.get(interaction?.data?.name)

			if(executor) {
				try {
					let handler = new InteractionHandler(bot, interaction)
					executor.execute(bot, handler, interaction?.data?.options)
						.then(() => this.emit("execute", executor, handler))
						.catch((e) => this.emit("promiseError", e, executor, handler))
				} catch(e) {
					this.emit("error", e, executor, handler)
				}
			}
		})
	}

	async register(...interaction) {
		if(Array.isArray(interaction[0]))
			interaction = interaction[0]
		interaction.forEach(int => {
			if(!int instanceof Interaction)
				throw new TypeError(`interaction must be Interaction`)
			this.interactions.set(int?.name, int)
		})
	}

	async loadFolder(folderPath) {
		if (typeof folderPath !== "string")
			throw new TypeError(`folderPath must be string, received ${typeof folderPath}`)

		await fs.readdirSync(folderPath)
		.filter(f => f.endsWith(".js") || f.endsWith(".ts"))
		.forEach(f => {
			const interactionClass = require(path.resolve("./", `${folderPath}${folderPath.endsWith("/") ? "" : "/"}${f}`)).default ??
				require(path.resolve("./", `${folderPath}${folderPath.endsWith("/") ? "" : "/"}${f}`))
			this.register(new interactionClass())
		})
	}

	async _createCommand(command) {
		this.bot?.guilds?.cache
		.forEach(g => this.bot?.api?.applications(this.bot?.user?.id).guilds(g.id)?.commands?.post({data: command}))
	}
}

module.exports = InteractionManager