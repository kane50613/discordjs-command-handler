class CommandManager {
	constructor() {
		this.commands = []
	}

	/**
	 * @description register command
	 * @param command command to register
	 */
	register(command) {
		if(Array.isArray(command))
			return command.forEach(this.register)
		this.commands.push(command)
	}

	/**
	 * @description return command by name or alias
	 * @param name command's name or alias
	 * @return boolean
	 */
	get(name) {
		return this.commands.find((c) => c?.name === name || c?.alias?.contains(name))
	}
}

module.exports = CommandManager