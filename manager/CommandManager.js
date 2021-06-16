const fs = require("fs");
const path = require("path")
const Group = require("../Base/Group")

const EventEmitter = require("events").EventEmitter

class CommandManager extends EventEmitter {
	constructor(bot, options) {
		this.commands = []
		this.groups = new Map()

		bot.on("message", async (m) => {
			if(!m?.content.startsWith(options?.prefix))
				return
			if(!options?.bot && m?.author?.bot)
				return
			if(!options?.dm && m?.channel?.type === "dm")
				return this.emit("dm", m)

			if(this.ratelimit?.isRatelimited(m?.member))
				return this.emit("ratelimit", this.ratelimit.getRatelimit(m?.member), m)

			let args = m.content?.split(" "),
				command = args[0]?.split(options.prefix)[1]
			args = args.slice(1)

			try {
				this.commands.get(command)?.execute(this.bot, m, args, m?.member, m?.guild)
				.then(() => this.emit("execute", this.commands.get(command), m))
				.catch((e) => this.emit("promiseError", e, this.commands.get(command), m))
				.finally(() => this.ratelimit?.updateRatelimit(m?.member))
			} catch (e) {
				this.emit("error", e, this.commands.get(command), m)
			}
		})
	}

	/**
	 * @description register command
	 * @param command command to register
	 */
	register(command) {
		if(Array.isArray(command)) command.forEach(cmd => this.register(cmd));

		this.commands.push(command)

		if(command?.group?.length > 0) {
			let group = this.groups.get(command?.group)
			if(!group) {
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
	 * @example commandHandler.commands.loadCommands("./commands")
	 */
	async loadCommands(folderPath) {
		if (typeof folderPath !== "string")
			throw new TypeError(`folderPath must be string, received ${typeof folderPath}`)

		await fs.readdirSync(folderPath)
		.filter(f => f.endsWith(".js"))
		.forEach(f => this.register(new (require(path.resolve("./", `${folderPath}${folderPath.endsWith("/") ? "" : "/"}${f}`)))()))
	}

	/**
	 * @description return command by name or alias
	 * @param name command's name or alias
	 * @return boolean
	 */
	get(name) {
		return this.commands.find((c) => c?.name === name.toLowerCase() || c?.alias?.includes(name.toLowerCase()))
	}

	getGroup(x) {
		return this.groups.get(x)
	}
}

module.exports = CommandManager