const _ = require("lodash");
const path = require("path");
const { createAssociation } = require("./association.js");
const loader = require("../common/loader.js");
const config = require("../config");

const exportModels = {
  initModels: async () => {
    const { Sequelize, DataTypes } = require("sequelize");

    const DEFAULT_FIELDS = {
      id: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
      },
    };

    const DEFAULT_OPTIONS = {
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    };

    const DEFAULT_INIT = async () => {};

    const sequelize = new Sequelize({
      ...config.db,
    });

    sequelize.union = async (model1, model2, options1, options2, option) => {
      const res1 = model1.findAll(options1);
      let res = res1.concat(model2.findAll(options2));
      if (option.distinct) {
        res = [...new Set(res)];
        return res;
      }
      return res;
    };

    const models = loader.load(__dirname, {
      loadFunc(file) {
        const modelName = path.parse(file).name;
        const modelConf = require(file);
        const model = sequelize.define(
          _.snakeCase(modelName),
          _.merge({}, DEFAULT_FIELDS, modelConf.fields),
          _.merge({}, DEFAULT_OPTIONS, modelConf.option)
        );
        console.log(111);
        model.modelConf = modelConf;
        return model;
      },
      mapKey(key) {
        return `${_.camelCase(key)}Md`;
      },
    });
    console.log(2);
    await createAssociation(models);

    process.on("unhandledRejection", (error) => {
      if (error.message === "database disk image is malformed") {
        console.log(error);
      }
    });

    try {
      await sequelize.sync({ alter: true });
    } catch (err) {
      console.log("syncErr:", err.message);
    }

    try {
      for (let key of Object.keys(models)) {
        const initFunc = models[key].modelConf.init || DEFAULT_INIT;
        await initFunc(models);
      }
    } catch (err) {
      console.log("initErr:", err.message);
    }
    _.assign(exportModels, models, { sequelize });
  },
};

module.exports = exportModels;
