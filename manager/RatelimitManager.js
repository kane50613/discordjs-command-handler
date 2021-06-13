const User = require("../Base/User")

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
	isRateLimited(user) {
		return !this.options?.bypass?.users?.includes(user?.id) ||
			!this.options?.permissions?.some(p => user?.permissions?.has(p)) ||
			!this.options?.roles?.some(r => user?.roles?.cache?.find(r)) ||
			new Date().getTime() - this.ratelimit.get(user?.id)?.lastMessage < this.options.interval
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