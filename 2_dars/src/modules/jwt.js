const { sign, verify } = require("jsonwebtoken")
const { SECRET_WORD } = require("../config")

module.exports.generateToken = (data) => {
    try {
        return sign(data, SECRET_WORD)
    } catch(e) {
        console.log(e)
    }
}

module.exports.chechToken = (token) => {
    try {
        return verify(token, SECRET_WORD)
    } catch(e) {
        return false
    }
}