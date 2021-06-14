const EventEmitter = require("events").EventEmitter

const RateLimitManager = require("./manager/RatelimitManager")
const CommandManager = require("./manager/CommandManager")

class CommandHandler extends EventEmitter {
	static Command = require("./Base/Command")

	options = {
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
		bot: false
	}


	constructor(bot, options) {
		super()

		this.bot = bot
		this.commands = new CommandManager()

		if(this.options)
			Object.assign(this.options, options)
		if(this.options?.ratelimit?.enable)
			this.ratelimit = new RateLimitManager(this?.options?.ratelimit)

		this.bot.on("message", async (m) => {
			if(!m?.content.startsWith(this.options?.prefix))
				return
			if(!this.options?.bot && m?.author?.bot)
				return
			if(!this.options?.dm && m?.channel?.type === "dm")
				return this.emit("dm", m)

			if(this.ratelimit?.isRateLimited(m?.member))
				return this.emit("ratelimit", m)

			let args = m.content?.split(" "),
				command = args[0]?.split(this.options.prefix)[1]
			args = args.slice(1)

			this.commands.get(command)?.execute(this.bot, m, args, m?.member, m?.guild)
			.then(() => this.emit("execute", this.commands.get(command), m))
			.catch((e) => this.emit("error", e, this.commands.get(command), m))
		})
	}
}

module.exports = CommandHandler