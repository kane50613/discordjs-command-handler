const CommandManager = require("./manager/CommandManager")
const RatelimitManager = require("./manager/RatelimitManager")
const InteractionManager = require("./manager/InteractionManager")
const Util = require("./Util")

let defaultOptions = {
	ratelimit: {
		enable: false,
		interval: 5000,
		bypass: {
			users: [],
			permissions: [],
			roles: []
		}
	},
	prefix: "PREFIX",
	dm: false,
	bot: false,
	command: true,
	interaction: true
}

module.exports = (bot, options) => {
	if (options && Util.isObject(options))
		defaultOptions = Util.assignObject(defaultOptions, options)

	if (defaultOptions?.command)
		bot.commands = new CommandManager(bot, defaultOptions)

	if (defaultOptions?.interaction)
		bot.interaction = new InteractionManager(bot, defaultOptions)
}

module.exports.Command = require("./Base/Command")
module.exports.Util = require("./Util")