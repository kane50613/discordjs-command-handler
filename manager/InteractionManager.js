const Interaction = require("../Base/Interaction")
const EventEmitter = require("events").EventEmitter

class InteractionManager extends EventEmitter {

	EPHEMERAL_FLAG_ID = 64

	constructor(bot, options) {
		super()

		this.interactions = new Map()
		this.bot = bot

		bot.on("ready", () => this.init(bot, options))
	}

	async init(bot, options) {
		this.interactions.forEach(c => this._createCommand(c))

		bot.ws.on("INTERACTION_CREATE", async (interaction) => {
			let firstReply = true
			interaction.reply = (content, publicVisible = false) => {
				let data = {
					data: {
						type: 4,
						data: typeof content === "string" ? { content } : content,
						flags: publicVisible ? this.EPHEMERAL_FLAG_ID : null
					}
				}

				let reply = firstReply ?
					bot.api.interactions(interaction?.id, interaction?.token)?.callback?.post(data) :
					bot.api.webhooks(bot?.user?.id, interaction?.token)?.post(data)
				firstReply = true

				return reply.then(r => r?.id ?? "@original")
			}

			this.interactions.get(interaction?.data?.name)?.execute(bot, interaction, interaction?.data?.options, interaction.member)
		})
	}

	async register(interaction) {
		if(Array.isArray(interaction))
			return interaction.forEach(this.register)
		if(!interaction instanceof Interaction)
			throw new TypeError(`interaction must be Interaction`)
		this.interactions.set(interaction?.name, interaction)
	}

	async _createCommand(command) {
		this.bot?.guilds?.cache
		.forEach(g => this.bot?.api?.applications(this.bot?.user?.id).guilds(g.id)?.commands?.post({data: command}))
	}
}

module.exports = InteractionManager