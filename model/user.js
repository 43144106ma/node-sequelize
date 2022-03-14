const md5 = require('md5');
const { DataTypes } = require('sequelize');

const config = require('../config');
const uid = require('../common/uid');

module.exports = {
  fields: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    errorTimes: {
      type: DataTypes.NUMBER,
    },
  },
  async init(models) {
    const userMd  = models.userMd;

    const admin = await userMd.findOne({ where: { name: config.admin.username } });
    if (!admin) {
      const salt = uid();
      const password = md5(`${config.admin.password}-${salt}`);

      await userMd.create({ name: config.admin.username, salt, password });
    }
  },
};
