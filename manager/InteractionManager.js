const Interaction = require("../Base/Interaction")
const EventEmitter = require("events").EventEmitter

const SlashCommand = require("discord-slash-commands-client")

class InteractionManager extends EventEmitter {
	constructor(bot, options) {
		super()

		this.client = new SlashCommand.Client(
			bot?.token,
			bot?.user?.id
		)
		this.interactions = []

		bot.ws.on("INTERACTION_CREATE", async (interaction) => {
			console.log(interaction)
		})
	}

	register(interaction) {
		if(Array.isArray(interaction))
			return interaction.forEach(this.register)
		if(!interaction instanceof Interaction)
			throw new TypeError(`interaction must be Interaction`)
		await this.client.createCommand(interaction)
		this.interactions.push(interaction)
	}
}

module.exports = InteractionManager