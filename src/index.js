const { createPlugin } = require("stylelint");
const rule1 = require("./rules").rule;

module.exports = createPlugin("@productboardlabs/rule1", rule1);
