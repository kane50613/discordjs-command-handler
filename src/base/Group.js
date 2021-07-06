class Group {
	constructor(name, description) {
		this.name = name
		this.description = description
		this.commands = []
	}

	register(command) {
		if(Array.isArray(command))
			return command.forEach(this.register)
		this.commands.push(command)
	}
}

module.exports = Group