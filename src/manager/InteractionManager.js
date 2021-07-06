const Interaction = require("../base/Interaction")
const InteractionHandler = require("../handler/InteractionHandler")
const Util = require("../Util")
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

	/**
	 * @description register interaction
	 * @param interaction interaction(s) to register
	 */
	register(...interaction) {
		if(Array.isArray(interaction[0]))
			interaction = interaction[0]
		interaction.forEach(int => {
			if(!int instanceof Interaction)
				throw new TypeError(`interaction must be Interaction`)
			this.interactions.set(int?.name, int)
		})

		return this
	}

	/**
	 * @description Register interactions in folder
	 * @param {String} folderPath Path to folder
	 * @example bot.interaction.loadFolder("./commands")
	 */
	loadFolder(folderPath) {
		this.register(Util.loadFolder(folderPath))
	}

	async _createCommand(command) {
		this.bot?.guilds?.cache
		.forEach(g => this.bot?.api?.applications(this.bot?.user?.id).guilds(g.id)?.commands?.post({data: command}))
	}
}

module.exports = InteractionManager