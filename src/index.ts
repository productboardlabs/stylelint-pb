import stylelint from "stylelint";

export const ruleName = "color-hex-case";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Error"
});

const rule = function(expectation, options, context) {
  return (root, result) => {};
};

rule.ruleName = ruleName;
rule.messages = messages;

export default rule;
