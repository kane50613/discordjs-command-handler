const Interaction = require("../../Base/Interaction");

class Ping extends Interaction {
	constructor() {
		super(
			"ping",
			"取得機器人延遲"
		)
	}

	async execute(bot, interaction) {

	}


	// {
	//   version: 1,
	//   type: 2,
	//   token: 'aW50ZXJhY3Rpb246ODU0NjI0NTI3MjgyNjAyMDI0Ok01dFJuSk5yNXZiZkwycjdnSjlnRGFMbDZGZWQ5dW5vZHNHQjZxSXNKTHpIVXpLVzFnb3NHSjlidmdjNEJjZVFOSkNVT2VMQWtNTV
	// FMR2NHTGhBQ1pEVnBZVEtoeHVpbFUycGxRREY2U3dkN0liMDdrM0NpYTNMTXYyckVyR0tr',
	//   member: {
	//     user: {
	//       username: '凱恩Kane',
	//       public_flags: 131136,
	//       id: '498505540612259840',
	//       discriminator: '5384',
	//       avatar: 'd0506da05fe768ed4a8d0b8314199929'
	//     },
	//     roles: [
	//       '600370244833509377',
	//       '600384025676480534',
	//       '705755328821854308',
	//       '710118600123482122',
	//       '710118732789448716',
	//       '738312875944312833',
	//       '811446073809174559'
	//     ],
	//     premium_since: null,
	//     permissions: '137438953471',
	//     pending: false,
	//     nick: '可愛小天使凱恩醬 ٩(•ᴗ•)۶',
	//     mute: false,
	//     joined_at: '2019-07-15T16:30:47.262000+00:00',
	//     is_pending: false,
	//     deaf: false,
	//     avatar: null
	//   },
	//   id: '854624527282602024',
	//   guild_id: '600363644991176822',
	//   data: { name: 'ping', id: '854624496248946708' },
	//   channel_id: '796400657840996352',
	//   application_id: '840770984821784601'
	// }
}

module.exports = Ping