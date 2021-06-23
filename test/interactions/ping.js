const Interaction = require("../../Base/Interaction");

class Ping extends Interaction {
	constructor() {
		super(
			"ping",
			"取得機器人延遲"
		)
	}

	async execute(bot, interaction, options, member) {
		interaction.reply("pog!")
	}
}

module.exports = Ping