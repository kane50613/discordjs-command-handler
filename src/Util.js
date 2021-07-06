const path = require("path")
const fs = require("fs")

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

	static loadFolder = (fPath) => {
		if (typeof fPath !== "string")
			throw new TypeError(`folderPath must be string, received ${typeof fPath}`)

		return fs.readdirSync(fPath)
		.filter(f => f.endsWith(".js") || f.endsWith(".ts"))
		.map(c => {
			let f = require(path.resolve("./", `${fPath}${fPath.endsWith("/") ? "" : "/"}${c}`))
			f = f.default ?? f
			return new f()
		})
	}
}

module.exports = Util