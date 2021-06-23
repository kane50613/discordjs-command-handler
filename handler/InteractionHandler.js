const InteractionResponse = require("../Base/InteractionResponse")
const { MessageEmbed } = require("discord.js")

class InteractionHandler {

	EPHEMERAL_FLAG_ID = 64

	#firstReply = true

	constructor(bot, interaction) {
		this.bot = bot
		this.interaction = interaction
	}

	/**
	 * @param content
	 * @param publicVisible whether the message is visible to everyone
	 * @return {Promise<InteractionResponse>}
	 */
	reply = async (content, publicVisible = false) => {
		let data = {
			data: {
				type: 4,
				data: {
					...this.buildInteractionData(content),
					flags: publicVisible ? this.EPHEMERAL_FLAG_ID : null
				}
			}
		}

		let reply = this.#firstReply ?
			await this.bot.api.interactions(this.interaction?.id, this.interaction?.token)?.callback?.post(data) :
			await this.bot.api.webhooks(this.bot?.user?.id, this.interaction?.token)?.post(data.data)
		this.#firstReply = true

		reply = new InteractionResponse(this.bot, this.interaction, reply)

		return reply
	}

	/**
	 * @param publicVisible whether the message is visible to everyone
	 * @return {Promise<*>}
	 */
	thinking = async (publicVisible) => {
		if(this.#firstReply)
			return
		this.#firstReply = true
		await this.bot.api.interactions(this.interaction?.id, this.interaction?.token)?.callback?.post({
			data: {
				type: 5,
				data: {
					content: "",
					flags: publicVisible ? this.EPHEMERAL_FLAG_ID : null
				}
			}
		})

		this.bot.emit("INTERACTION_CREATE", this.interaction)

		return this.interaction
	}

	buildInteractionData(content) {
		if(content instanceof MessageEmbed)
			content = { embeds: [content] }
		if(content?.embed)
			content = { ...content, embeds: [content.embed], content: content?.content, embed: undefined }
		return typeof content === "string" ? { content } : content
	}
}

module.exports = InteractionHandler