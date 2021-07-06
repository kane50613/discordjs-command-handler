class Command {
	constructor(name, description, usage, group, alias) {
		this.name = name.toLowerCase()
		this.description = description || ""
		this.usage = usage || ""
		this.group = group
		this.alias = alias?.map(x => x.toLowerCase()) || []
	}

	async execute(bot, message, args, member, guild) {
	}
}

module.exports = Command