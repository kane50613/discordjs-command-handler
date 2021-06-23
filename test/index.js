const Discord = require('discord.js')

const bot = new Discord.Client()
require("../index")(bot, {
	prefix: '.',
	ratelimit: {
		enable: true
	}
})

bot.commands.register(new (require("./commands/ping"))())

bot.commands.on("error", (e) => console.error(e))
bot.commands.on("promiseError", (e) => console.error(e))

bot.commands.on("ratelimit", (c, m) => console.log(c))

bot.interaction.register(new (require("./interactions/ping"))())

bot.on('ready', () => console.log('bot ready'))

bot.login(process.env.TOKEN)