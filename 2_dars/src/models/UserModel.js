module.exports = async function (Sequelize, sequelize) {
    return sequelize.define("users", {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.DataTypes.STRING(32),
            allowNull: false,
        },
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        password: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        }
    })
}