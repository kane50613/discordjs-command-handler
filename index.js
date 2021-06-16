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
	interaction: true
}

module.exports = (bot, options) => {
	if(options && Util.isObject(options))
		defaultOptions = Util.assignObject(defaultOptions, options)

	bot.commands = new CommandManager(bot, defaultOptions)

	if(defaultOptions?.ratelimit?.enable)
		bot.ratelimit = new RatelimitManager(bot, defaultOptions?.ratelimit)

	if(defaultOptions?.interaction)
		bot.interaction = new InteractionManager(bot, defaultOptions)
}