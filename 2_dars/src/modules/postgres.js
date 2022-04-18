const { Sequelize } = require("sequelize")
const { DB_URL } = require("../config")
const AttemptModel = require("../models/AttemptModel")
const SessionModel = require("../models/SessionModel")
const UserModel = require("../models/UserModel")

// loglarni consolda ko'rsatib turadi
const sequelize = new Sequelize(DB_URL, {
    logging: (e) => console.log("SQL: ", e),
})

module.exports = async function () {
    try {
        const db = {}

        // models
        db.users = await UserModel(Sequelize, sequelize)
        db.sessions = await SessionModel(Sequelize, sequelize)
        db.attempts = await AttemptModel(Sequelize, sequelize)

        // force: true qilsak har safar databasa yangilanganda table larbi o'chirib tashlab qayta create qiladi
        // alter: true o'zgargan ustunlar bo'lsa o'zgartirib qo'yadi
        sequelize.sync({ alter: false })
        
        // references
        db.users.hasMany(db.sessions, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            }
        })

        db.sessions.belongsTo(db.users, {
            foreignKey: {
                name: "user_id", 
                allowNull: false,
            }
        })

        db.users.hasOne(db.attempts, {
            foreignKey: {
                name: "user_id", 
                allowNull: false,
            }
        })

        db.attempts.belongsTo(db.users, {
            foreignKey: {
                name: "user_id", 
                allowNull: false,
            }
        })

        return db
    } catch(e) {
        console.log(e)
    }
}
