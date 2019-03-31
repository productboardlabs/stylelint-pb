const { createPlugin } = require("stylelint");
const rules = require("./rules");

module.exports = Object.values(rules).map(rule =>
  createPlugin(rule.ruleName, rule)
);
