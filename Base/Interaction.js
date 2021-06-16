class Interaction {
	constructor(name, args, description, usage, group) {
		this.name = name.toLowerCase()
		this.args = args || {}
		this.description = description || ""
		this.usage = usage || ""
		this.group = group
	}

	async execute(bot, interaction) {

	}
}

module.exports = Interaction