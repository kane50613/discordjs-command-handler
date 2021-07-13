class EventHandler {
	_events = {}

	on(name, listener) {
		this._events[name] = [...this._events[name] ?? [], listener]
	}

	emit(name, ...args) {
		this._events[name]?.forEach(l => l(...args))
	}

	removeListener(name, listener) {
		this._events[name] = this._events[name]?.filter(x => x !== listener) ?? []
	}
}

module.exports = EventHandler