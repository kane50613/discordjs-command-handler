const EventEmitter = require("events").EventEmitter

class InteractionManager extends EventEmitter {
	constructor(bot, options) {
		bot.ws.on("INTERACTION_CREATE", async (interaction) => {
			if(!options?.dm && m?.channel?.type === "dm")
				return this.emit("dm", m)
		})
	}

}

module.exports = InteractionManager