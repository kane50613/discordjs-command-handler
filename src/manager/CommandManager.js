const Group = require("../base/Group")
const RatelimitManager = require("./RatelimitManager")
const Command = require("../base/Command")
const Util = require("../Util")

const {EventEmitter} = require("events")

class CommandManager extends EventEmitter {
	constructor(bot, options) {
		super()

		this.commands = []
		this.middlewares = []
		this.groups = new Map()

		if (options?.ratelimit?.enable)
			this.ratelimit = new RatelimitManager(options?.ratelimit)

		bot.on("messageCreate", async (m) => {
			if (
				!m?.content.startsWith(options?.prefix) ||
				(!options?.bot && m?.author?.bot)
			)
				return
			if (!options?.dm && m?.channel?.type === 'DM')
				return this.emit("dm", m)

			if (this?.ratelimit?.isRatelimited(m?.member))
				return this.emit("ratelimit", this?.ratelimit?.getRatelimit(m?.member), m)

			const [command, ...args] = m.content.slice(options.prefix.length).trim().split(/ +/g)
			const executor = bot.commands.get(command)

			if(!executor)
				return

			try {
				let executable = true
				for(let middleware of this.middlewares)
					try {
						await new Promise((r, j) => middleware(executor, m, args, r, j))
					} catch(e) {
						executable = false
						break
					}

				if(!executable)
					return

				executor?.execute(bot, m, args)
					.then(() => this.emit("execute", executor, m))
					.catch((e) => this.emit("promiseError", e, executor, m))
					.finally(() => bot.ratelimit?.updateRatelimit(m?.member))
			} catch (e) {
				this.emit("error", e, executor, m)
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
	 * @returns {?Command}
	 */
	get(name) {
		return this.commands.find((c) => c?.name === name.toLowerCase() || c?.alias?.includes(name.toLowerCase()))
	}

	getGroup(x) {
		return this.groups.get(x)
	}

	middleware(handler) {
		if(typeof handler !== 'function')
			throw new TypeError('middleware must be a function or arrow function')

		this.middlewares.push(handler)
	}
}

module.exports = CommandManager