const _ = require("lodash");
const fs = require("fs");
const path = require("path");

function load(dirname, option) {
  const opt = option || {};
  const files = fs.readdirSync(dirname);
  const extName = opt.extName || "js";
  const pack = {};
  files
    .filter(
      (file) =>
        fs.lstatSync(path.resolve(dirname, file)).isFile() &&
        file !== "index.js" &&
        file !== "association.js" &&
        ((!opt.filter && _.endsWith(file, `.${extName}`)) ||
          (opt.filter && opt.filter(file)))
    )
    .forEach((file) => {
      const basename = path.basename(file).split(".")[0];

      // key
      let key = _.camelCase(basename);
      if (opt.mapKey) {
        key = opt.mapKey(key);
      }

      // value
      let value = null;
      if (opt.loadFunc) {
        value = opt.loadFunc(path.resolve(dirname, file));
      } else {
        value = require(path.resolve(dirname, file));
      }

      pack[key] = value;
    }, {});

  if (opt.recursive) {
    files
      .filter((folder) =>
        fs.lstatSync(path.resolve(dirname, folder)).isDirectory()
      )
      .forEach((folder) => {
        // key
        const key = _.camelCase(folder);

        // value
        const value = load(path.resolve(dirname, folder), opt);

        pack[key] = value;
      });
  }
  return pack;
}

module.exports = {
  load,
};
