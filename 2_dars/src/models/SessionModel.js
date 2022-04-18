module.exports = async function (Sequelize, sequelize) {
    return sequelize.define("sessions", {
        id: {
            type: Sequelize.DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        useragent: {
            type: Sequelize.DataTypes.TEXT,
            allownull: false,
        },
        ip: {
            type: Sequelize.DataTypes.INET,
            allowNull: false,
        },
    })
}