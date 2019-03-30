const { createPlugin } = require("stylelint");
const rule = require("./rules");

module.exports = createPlugin(
  "@productboardlabs/smart-color-replacement",
  rule
);
