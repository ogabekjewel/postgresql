module.exports = async function(Sequelize, sequelize) {
    return sequelize.define("attempts", {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4(),
            primaryKey: true,
        },
        attempt: {
            type: Sequelize.DataTypes.SMALLINT,
            defaultValue: 1,
            allowNull: false,
        },
        expire: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
        },
    })
}
