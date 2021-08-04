const { MessageEmbed } = require("discord.js")

class InteractionResponse {
	constructor(bot, interaction, message) {
		message.id = message?.id ?? "@original"

		this.bot = bot
		this.interaction = interaction
		this.message = message
		this.webhook = this.getWebhook()
	}

	async edit(content) {
		let data = this.buildInteractionData(content)
		await this.webhook?.patch({data})

		return this
	}

	async delete() {
		await this.webhook?.delete()

		return undefined
	}

	buildInteractionData(content) {
		if(content instanceof MessageEmbed)
			content = { embeds: [content] }
		if(content.embed)
			content = { embeds: [content.embed], content: content?.content }
		return typeof content === "string" ? { content } : content
	}

	getWebhook() {
		return this.bot?.api?.webhooks(this.bot?.user?.id, this.interaction?.token)
			?.messages(this.message.id)
	}
}

module.exports = InteractionResponse