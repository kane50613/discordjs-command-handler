const Command = require("../../Base/Command");

class Ping extends Command {
	constructor() {
		super(
			"ping",
			"ping the bot",
			".ping",
			"general",
			["pong"]
		);
	}

	async execute(message, args, member, guild) {
		message.reply('pong!')
	}
}

module.exports = Ping