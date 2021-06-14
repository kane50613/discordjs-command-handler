const CommandHandler = require('../CommandHandler')
const Discord = require('discord.js')

const bot = new Discord.Client()
const commandHandler = new CommandHandler(bot, {
	prefix: '.',
	ratelimit: {
		enable: true
	}
})

commandHandler.commands.register(require("./commands/ping"))

commandHandler.on("ratelimit", (c, m) => console.log(c))

bot.on('ready', () => console.log('bot ready'))

bot.login(process.env.TOKEN)