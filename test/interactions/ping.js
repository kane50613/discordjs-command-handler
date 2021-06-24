const Interaction = require("../../Base/Interaction")
const Discord = require("discord.js")

class Ping extends Interaction {
	constructor() {
		super(
			"pong",
			"取得機器人延遲"
		)
	}

	async execute(bot, interaction, options) {
		let emb = await interaction.reply("pog!")
		await emb.edit({
			embed: new Discord.MessageEmbed()
				.setTitle("pog!")
		})
		await emb.delete()
	}
}

module.exports = Ping