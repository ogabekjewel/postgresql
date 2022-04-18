const bcrypt = require("bcrypt")

module.exports.generateHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    } catch(e) {
        console.log(e)
    }
}

module.exports.compareHash = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash)
    } catch(e) {
        return false
    }
}

