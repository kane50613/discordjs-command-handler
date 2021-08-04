class Command {
	constructor(name, description, usage, group, alias) {
		this.name = name.toLowerCase()
		this.description = description ?? ""
		this.usage = usage ?? ""
		this.group = group
		this.alias = alias?.map(x => x.toLowerCase()) ?? []
	}

	async execute(bot, message, args) {
	}
}

module.exports = Command