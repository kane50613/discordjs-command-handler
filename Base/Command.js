class Command {
	constructor(options) {
		this.name = options.name.toLowerCase()
		this.description = options.description || ""
		this.usage = options.usage || ""
		this.group = options.group
		this.alias = options.alias?.map(x => x.toLowerCase()) || []
	}

	async execute(bot, message, args, member, guild) {
	}
}

module.exports = Command