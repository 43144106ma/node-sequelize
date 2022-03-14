const path = require('path');
const colors = require('colors/safe');

Error.stackTraceLimit = 999;

// 判断是否是业务代码
function isMyCode(ppath) {
  return !ppath.includes('node_modules') && !ppath.includes('(internal/');
}
const rootPath = path.resolve(__dirname, '..');
Error.prepareStackTrace = err => {
  let lines = err.stack.split('\n');
  let include = false;
  lines = lines
    .filter(l => { // 合并非业务代码
      const myCode = isMyCode(l);
      if (myCode) {
        include = true;
        return true;
      }
      if (include) {
        include = false;
        return true;
      }
      return false;
    })
    .map(l => {
      const line = l.replace(rootPath, '');
      if (!isMyCode(line)) {
        return colors.grey('    ...'); // 非业务代码置灰
      }
      return line.replace(rootPath, '');
    });
  lines = lines.join('\n');
  return lines;
};
