const User = require("../base/User")

class RatelimitManager {
	ratelimit = new Map()

	constructor(options) {
		this.options = options
	}

	/**
	 * @description to check whether the user is ratelimited
	 * @param user user to check
	 * @returns {boolean}
	 */
	isRatelimited(user) {
		if(this.options?.bypass?.users?.includes(user?.id) ||
			this.options?.permissions?.some(p => user?.permissions?.has(p)) ||
			this.options?.roles?.some(r => user?.roles?.cache?.get(r)))
		return false

		if(!this.ratelimit.get(user?.id)) {
			this.updateRatelimit(user)
			return false
		}

		return new Date().getTime() - this.ratelimit.get(user?.id)?.lastMessage < this.options?.interval
	}

	getRatelimit(user) {
		if(!this.ratelimit.get(user?.id)) {
			this.updateRatelimit(user)
			return 0
		}

		return this.options?.interval - (new Date().getTime() - this.ratelimit.get(user?.id)?.lastMessage)
	}

	/**
	 * @description update a user's ratelimit
	 * @param user user to update
	 */
	updateRatelimit(user) {
		this.ratelimit.set(user?.id, new User(user))
	}
}

module.exports = RatelimitManager