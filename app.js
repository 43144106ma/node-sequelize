const { initModels } = require("./model");

(async () => {
  let start = Number(new Date());
  console.log("start initModels");
  await initModels();
  let end = Number(new Date());
  console.log("initModels:", end - start);
  console.log("end initModels");
})();
