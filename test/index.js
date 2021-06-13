const CommandHandler = require('../CommandHandler')
const Discord = require('discord.js')

const bot = new Discord.Client()
const commandHandler = new CommandHandler(bot, {
	prefix: '.'
})

commandHandler.commands.register(require("./commands/ping"))

bot.on('ready', () => console.log('bot ready'))

bot.login(process.env.TOKEN)