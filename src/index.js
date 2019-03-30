const { createPlugin } = require("stylelint");
const rule = require("./rules");

module.exports = createPlugin("@productboard/smart-color-replacement", rule);
