const Group = require("../Base/Group");

class CommandManager {
	constructor() {
		this.commands = []
		this.groups = new Map()
	}

	/**
	 * @description register command
	 * @param command command to register
	 */
	register(command) {
		if(Array.isArray(command))
			return command.forEach(this.register)
		this.commands.push(command)

		if(command?.group?.length > 0) {
			let group = this.groups.get(command?.group)
			if(!group) {
				group = new Group(command?.group)
				this.groups.set(command.group, group)
			}
			group.register(command)
		}
	}

	/**
	 * @description return command by name or alias
	 * @param name command's name or alias
	 * @return boolean
	 */
	get(name) {
		return this.commands.find((c) => c?.name === name || c?.alias?.contains(name))
	}

	getGroup(x) {
		return this.groups.get(x)
	}
}

module.exports = CommandManager