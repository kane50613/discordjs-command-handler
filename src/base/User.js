class User {
	constructor(user) {
		this.id = user?.id
		this.lastMessage = new Date().getTime()
	}
}

module.exports = User