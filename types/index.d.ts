import { Message, Client, PermissionResolvable, GuildMember } from "discord.js"
import { EventEmitter } from "events";
import Discord from "discord.js";

declare module "@gary50613/discord.js-command-handler" {
    export default function (client: Client, initOptions: initOption): void;
}

export interface RateLimitOptions {
    enable?: boolean
    interval?: number
    bypass?: {
        users?: string[], // specific users ID can bypass ratelimit
        permissions?: keyof PermissionResolvable[], // specific permissions FLAG can bypass ratelimit
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
    public execute(bot: Client, message: Message, args: string[]): Promise<any>
}

export class Group {
    public name: string
    public description: string
    public commands: Command[]
    public constructor(name: string, description: string)
    public register(command: string): void
}

export class Interaction {
    public name: string
    public description: string;
    public options?: any[]
    public constructor(name: string, description: string, options?: any[])
    public execute(bot: Client, interaction: Discord.Interaction): Promise<any>
}

declare class User {
    public id: string;
    public lastMessage: number;
}

export interface CommandManagerEvents {
    dm: [Message],
    ratelimit: [number],
    execute: [Command, Message]
    error: [Error, Command, Message]
    promiseError: [Error, Command, Message]
}

declare class CommandManager extends EventEmitter {
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
     * @example bot.commands.loadFolder("./commands")
     */
    public loadFolder(folderPath: string): void
    /**
     * @description return command by name or alias
     * @param name command's name or alias
     * @return command
     */
    public get(name: string): Command
    public getGroup(groupName: string): Group

    public middleware(handler: (executor: Command, message: Message, args: string[], response: void, reject?: void) => void): void

    public on<K extends keyof CommandManagerEvents>(name: K, listener: (...args: CommandManagerEvents[K]) => void): this
    public once<K extends keyof CommandManagerEvents>(name: K, listener: (...args: CommandManagerEvents[K]) => void): this
    public ratelimit?: RatelimitManager
}

declare class InteractionManager extends EventEmitter {
    public interactions: Map<string, Interaction>
    public bot: Client
    public constructor(bot: Client)
    public register(...interaction: Interaction[]): Promise<this>
    public loadFolder(folderPath: string): Promise<this>

    public on(name: 'execute', listener: (executor: Interaction, handler: Interaction) => void): this
    public on(name: 'error' | 'promiseError', listener: (error: Error, executor: Interaction, handler: Discord.Interaction) => void): this

    public once(name: 'execute', listener: (executor: Interaction, handler: Discord.Interaction) => void): this
    public once(name: 'error' | 'promiseError', listener: (error: Error, executor: Interaction, handler: Discord.Interaction) => void): this
}

declare class RatelimitManager {
    public options: RateLimitOptions
    public ratelimit: Map<string, User>
    public isRatelimited(user: GuildMember): boolean
    public getRatelimit(user: GuildMember): number
    public updateRatelimit(user: GuildMember): void
}

export class Util {
    public static isObject(o: any): boolean
    public static assignObject<K, T extends Object>(o: K, t: T): K
    public static loadFolder(fPath: string): Command[]
}

declare module "discord.js" {
    export interface Client {
        commands: CommandManager
        interaction: InteractionManager
    }
}
