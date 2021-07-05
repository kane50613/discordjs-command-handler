const fs = require("fs");
const path = require("path")
const Group = require("../Base/Group")
const RatelimitManager = require("./RatelimitManager")
const Command = require("../Base/Command")

const EventEmitter = require("events").EventEmitter

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
	 * @param command command to register
	 */
	async register(command) {
		if (Array.isArray(command)) command.forEach(cmd => this.register(cmd));

		if (!command instanceof Command)
			throw new TypeError(`command must be Command`)

		this.commands.push(command)

		if (command?.group?.length > 0) {
			let group = this.groups.get(command?.group)
			if (!group) {
				group = new Group(command?.group)
				this.groups.set(command.group, group)
			}
			group.register(command)
		}

		return this
	}

	/**
	 * @description Register commands in folder
	 * @param {String} folderPath Path to folder
	 * @example bot.commands.loadCommands("./commands")
	 */
	async loadCommands(folderPath) {
		if (typeof folderPath !== "string")
			throw new TypeError(`folderPath must be string, received ${typeof folderPath}`)

		await fs.readdirSync(folderPath)
			.filter(f => f.endsWith(".js") || f.endsWith(".ts"))
			.forEach(f => {
				const commandClass = require(path.resolve("./", `${folderPath}${folderPath.endsWith("/") ? "" : "/"}${f}`)).default ?? require(path.resolve("./", `${folderPath}${folderPath.endsWith("/") ? "" : "/"}${f}`))
				this.register(new commandClass())
			})
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