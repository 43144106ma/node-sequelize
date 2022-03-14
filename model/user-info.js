const { DataTypes } = require("sequelize");

module.exports = {
  fields: {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
    },
  },
};
