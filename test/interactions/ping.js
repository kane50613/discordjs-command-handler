const Interaction = require("../../Base/Interaction")

class Ping extends Interaction {
	constructor() {
		super(
			"pong",
			"取得機器人延遲"
		)
	}

	async execute(bot, interaction, options, member) {
		let emb = await interaction.reply("pog!")
		await emb.delete()
	}
}

module.exports = Ping