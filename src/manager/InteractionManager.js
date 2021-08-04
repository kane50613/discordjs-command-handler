const Interaction = require("../base/Interaction")
const Util = require("../Util")
const {EventEmitter} = require("events")

class InteractionManager extends EventEmitter {
	constructor(bot) {
		super()

		this.interactions = new Map()
		this.bot = bot

		bot.on("interactionCreate", async (interaction) => {
			console.log(interaction)
			if(!interaction.isCommand())
				return

			let executor = this.interactions.get(interaction?.command?.name)
			if(executor) {
				try {
					executor.execute(bot, interaction)
						.then(() => this.emit("execute", executor, interaction))
						.catch((e) => this.emit("promiseError", e, executor, interaction))
				} catch(e) {
					this.emit("error", e, executor, interaction)
				}
			}
		})
	}

	/**
	 * @description register interaction
	 * @param interaction interaction(s) to register
	 */
	async register(...interaction) {
		if(Array.isArray(interaction[0]))
			interaction = interaction[0]
		for(let int of interaction){
			if(!int instanceof Interaction)
				throw new TypeError(`interaction must be Interaction`)
			if(!int?.name)
				throw new Error(`interaction must provide name`)
			if(this.interactions.get(int?.name))
				throw new Error(`interaction named "${int?.name}" already exist`)

			this.interactions.set(int?.name, int)
			await this.bot.application.commands.create(int)
		}

		return this
	}

	/**
	 * @description Register interactions in folder
	 * @param {String} folderPath Path to folder
	 * @example bot.interaction.loadFolder("./commands")
	 */
	async loadFolder(folderPath) {
		await this.register(Util.loadFolder(folderPath))
	}
}

module.exports = InteractionManager