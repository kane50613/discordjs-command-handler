class Util {

	static isObject = (o) => typeof o === "object" && !Array.isArray(o) && o !== null

	static assignObject = (o, t) => {
		Object.keys(o).forEach(x => {
			if(Util.isObject(o[x]) && Util.isObject(t[x]))
				o[x] = Util.assignObject(o[x], t[x])
			else if(t[x] !== undefined)
				o[x] = t[x]
		})

		return o
	}
}

module.exports = Util