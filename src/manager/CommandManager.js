const Group = require("../base/Group")
const RatelimitManager = require("./RatelimitManager")
const Command = require("../base/Command")
const Util = require("../Util")

const {EventEmitter} = require("events")

class CommandManager extends EventEmitter {
	constructor(bot, options) {
		super()

		this.commands = []
		this.groups = new Map()

		if (options?.ratelimit?.enable)
			this.ratelimit = new RatelimitManager(options?.ratelimit)

		bot.on("message", async (m) => {
			if (!m?.content.startsWith(options?.prefix))
				return
			if (!options?.bot && m?.author?.bot)
				return
			if (!options?.dm && m?.channel?.type === "dm")
				return this.emit("dm", m)

			if (this?.ratelimit?.isRatelimited(m?.member))
				return this.emit("ratelimit", this?.ratelimit?.getRatelimit(m?.member), m)

			const [command, ...args] = m.content.slice(options.prefix.length).trim().split(/ +/g)

			try {
				bot.commands.get(command)?.execute(bot, m, args, m?.member, m?.guild)
					.then(() => this.emit("execute", bot.commands.get(command), m))
					.catch((e) => this.emit("promiseError", e, bot.commands.get(command), m))
					.finally(() => bot.ratelimit?.updateRatelimit(m?.member))
			} catch (e) {
				this.emit("error", e, bot.commands.get(command), m)
			}
		})
	}

	/**
	 * @description register command
	 * @param command command(s) to register
	 */
	register(...command) {
		if(Array.isArray(command[0]))
			command = command[0]

		command.forEach(cmd => {
	        if (!cmd instanceof Command)
	            throw new TypeError(`command must be Command`)

	        this.commands.push(cmd)

	        if (cmd?.group?.length > 0) {
	            let group = this.groups.get(cmd?.group)
	            if (!group) {
	                group = new Group(cmd?.group)
	                this.groups.set(cmd.group, group)
	            }
	            group.register(cmd)
	        }
		})

		return this
	}

	/**
	 * @description Register commands in folder
	 * @param {String} folderPath Path to folder
	 * @example bot.commands.loadFolder("./commands")
	 */
	loadFolder(folderPath) {
		this.register(Util.loadFolder(folderPath))
	}

	/**
	 * @description return command by name or alias
	 * @param name command's name or alias
	 * @return command
	 */
	get(name) {
		return this.commands.find((c) => c?.name === name.toLowerCase() || c?.alias?.includes(name.toLowerCase()))
	}

	getGroup(x) {
		return this.groups.get(x)
	}
}

module.exports = CommandManager