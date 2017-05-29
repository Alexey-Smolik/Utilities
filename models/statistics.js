module.exports = function(sequelize, DataTypes) {
    var Statistics = sequelize.define('Statistics', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        arrear: {
            type: DataTypes.INTEGER
        },
        lastPayment: {
            type: DataTypes.DATE
        },
    },
        {
        timestamps: false
    });

    return Statistics;
};