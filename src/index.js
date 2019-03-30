const { createPlugin } = require("stylelint");
const rule = require("./rules");

module.exports = createPlugin("@productboardlabs/rule1", rule);
