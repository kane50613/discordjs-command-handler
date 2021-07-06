import { Message, MessageEmbed, Client, PermissionResolvable, GuildMember, Guild } from "discord.js"
import { EventEmitter } from "events"

declare module "@gary50613/discord.js-command-handler" {
    export default function (client: Client, initOptions: initOption): void;

    export type InteractionMessageContent = string | { embeds?: MessageEmbed, content: string }

    export interface RateLimitOptions {
        enable?: boolean
        interval?: number
        bypass?: {
            users?: string[], // specific users ID can bypass ratelimit 
            permissions?: keyof PermissionResolvable[], // specific perimissions FLAG can bypass ratelimit
            roles?: string[] // // specific roles ID can bypass ratelimit
        }
    }

    export interface initOption {
        ratelimit?: RateLimitOptions,
        prefix: string, // bot's prefix
        dm?: boolean, // whether accept dm commands
        bot?: boolean // whether accept bot execute command
        command?: true,
        interaction?: true
    }

    export class Command {
        public name: string;
        public description: string;
        public usage: string;
        public group: string;
        public aliases: string[]
        public constructor(name: string, description: string, usage: string, group: string, alias?: string[])
        public execute(bot: Client, message: Message, args: string[], member: GuildMember, guild: Guild): Promise<any>
    }

    class Group {
        public name: string
        public description: string
        public commands: Command[]
        public constructor(name: string, description: string)
        public register(command: string): void
    }

    class Interaction {
        public name: string
        public description: string;
        public options: any[]
        public execute(bot: Client, interaction: any, options: any, member: any): Promise<any>
    }

    class InteractionResponse {
        public bot: Client;
        public interaction: any;
        public message: any
        public edit(content: any): Promise<any>
        public delete(): Promise<void>
        public buildInteractionData(content: any): InteractionMessageContent
        public constructor(bot: Client, interaction: any, message: any)
    }

    class User {
        public id: string;
        public lastMessage: number;
    }

    class InteractionHandler {
        public EPHEMERAL_FLAG_ID: number;
        private firstReply: boolean;
        public constructor(bot: Client, interaction: any)
        /**
	    * @param content
	    * @param publicVisible whether the message is visible to everyone
	    * @return {Promise<InteractionResponse>}
	    */
        public reply(content: any, publicVisible: boolean): Promise<InteractionResponse>
        /**
	    * @param publicVisible whether the message is visible to everyone
	    * @return {Promise<*>}
	    */
        public thinking(publicVisible: boolean): Promise<any>
        public buildInteractionData(content: any): InteractionResponse
    }

    class CommandManager extends EventEmitter {
        public commands: Command[]
        public groups: Map<string, Group>
        /**
	    * @description register command
	    * @param command command to register
	    */
        public register(...command: Command[]): this
        /**
	    * @description Register commands in folder
	    * @param {String} folderPath Path to folder
	    * @example bot.commands.loadCommands("./commands")
	    */
        public loadFolder(folderPath: string): Promise<void>
        /**
	    * @description return command by name or alias
	    * @param name command's name or alias
	    * @return command
	    */
        public get(cmdName: string): Command
        public getGroup(groupName: string): Group
    }

    class InteractionManager extends EventEmitter {
        public interactions: Map<string, Interaction>
        public bot: Client
        public constructor(bot: Client, options: RateLimitOptions)
        public init(bot: Client, options: RateLimitOptions): Promise<void>
        public register(...interaction: Interaction[]): this
        public loadFolder(folderPath: string):Promise<void>
        public _createCommand(command: any): Promise<void>
    }

    class RatelimitManager {
        public options: RateLimitOptions
        public ratelimit: Map<string, User>
        public isRatelimited(user: GuildMember): boolean
        public getRatelimit(user: GuildMember): number
        public updateRatelimit(user: GuildMember): void
    }

    export class Util {
        static isObject(o: any): boolean
        static assignObject(o: object, t: object): object
    }
}

declare module "discord.js" {
    interface Client {
        commands: CommandManager
        interaction: InteractionManager
    }
}
