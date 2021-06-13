class Command {
	constructor(name, description, usage, group, alias) {
		this.name = name
		this.description = description || ""
		this.usage = usage || ""
		this.group = group
		this.alias = alias || []
	}

	execute(message, args, member, guild) {

	}
}

module.exports = Command