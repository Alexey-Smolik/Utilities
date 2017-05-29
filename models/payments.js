module.exports = function(sequelize, DataTypes) {
    var Payments = sequelize.define('Payments', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            amount: {
                type: DataTypes.INTEGER
            },
            Date: {
                type: DataTypes.DATE
            },
        },
        {
            timestamps: false
        });

    return Payments;
};