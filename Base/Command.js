class Command {
	constructor(name, description, usage, type, alias) {
		this.name = name || ""
		this.description = description || ""
		this.usage = usage || ""
		this.type = type || ""
		this.alias = alias || []
	}

	execute(message, args, member, guild) {

	}
}

module.exports = Command