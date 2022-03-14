const md5 = require('md5');

let count = 0;
module.exports = (length = 7) => {
  count += 1;
  return md5(`${Date.now()}-${count}`).substr(0, length);
};
