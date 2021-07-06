const { MessageEmbed } = require("discord.js")

class InteractionResponse {
	constructor(bot, interaction, message) {
		message.id = message?.id ?? "@original"

		this.bot = bot
		this.interaction = interaction
		this.message = message
	}

	edit = async (content) => {
		let data = this.buildInteractionData(content)
		await this.bot.api.webhooks(this.bot?.user?.id, this.interaction?.token)?.messages(this.message.id).patch({data})

		return this.message
	}

	delete = async () => {
		await this.bot.api.webhooks(this.bot?.user?.id, this.interaction?.token)?.messages(this.message?.id).delete()
	}

	buildInteractionData(content) {
		if(content instanceof MessageEmbed)
			content = { embeds: [content] }
		if(content.embed)
			content = { embeds: [content.embed], content: content?.content }
		return typeof content === "string" ? { content } : content
	}
}

module.exports = InteractionResponse