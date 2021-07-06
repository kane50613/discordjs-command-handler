const Command = require("../../src/base/Command");

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

	async execute(bot, message, args, member, guild) {
		message.reply('pong!')
	}
}

module.exports = Ping