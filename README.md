# djs-command-handler
> Simple command handler for discord.js

[繁體中文](doc/README-zh.md)

***

## Install
run this in your terminal
```shell
npm i @gary50613/djs-command-handler
```

## Test
```shell
npm i
npm test
```

## ✨ Features

- easy to set up
- works perfectly with discord.js
- **ratelimit support**
- commands group support

## Usage
basic how to initialize with [options](#options)
```js
const CommandHandler = require('../CommandHandler')
const Discord = require('discord.js')

const bot = new Discord.Client()
const commandHandler = new CommandHandler(bot, {
	prefix: "."
	//options
})
```

make a command
```js
const Command = require("../../Base/Command")

class Ping extends Command {
    constructor() {
        super(
            "ping", // name
            "ping the bot", // description
            ".ping", // usage
            "general", // group
            ["pong"] // alias
        );
    }
    
    // execute function to call
    execute(message, args, member, guild) {
        // just write like normal discord.js
        message.reply('pong!')
    }
}

module.exports = Ping
```

## Reference
### options
```js
{
  ratelimit: {
    enable: false, // whether enable ratelimit
      interval: 5000, // interval to limit
      bypass: {
        users: [], // specific users ID can bypass ratelimit 
        permissions: ["ADMINISTRATOR"], // specific perimissions FLAG can bypass ratelimit
        roles: [] // // specific roles ID can bypass ratelimit
    }
  },
  prefix: "PREFIX", // bot's prefix
  dm: false // whether accept dm commands
}
```

## Author
🧑‍💻 **Kane**
- Github @Gary50613

## ❤️ Contributing
Feel free to open [issue](https://github.com/Gary50613/discordjs-command-handler/issues)
or join [my discord server](https://discord.gg/ct2ufag)