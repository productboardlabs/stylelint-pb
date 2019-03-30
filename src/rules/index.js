const stylelint = require("stylelint");
const color = require("color");

const ruleName = "@productboardlabs/rule1";

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: failedColors =>
    failedColors
      .map(
        ({ used, suggested }) => `Colour "${used}" should be "${suggested}".`
      )
      .join(" ")
});

const rule = function(expectation, _, context) {
  return (root, result) => {
    const HEX_REGEX = /(#[a-f0-9]{3,6})/gi;
    const RGB_REGEX = /(rgb|rgba)\([^\)]*\)/gi;
    const HSL_REGEX = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/gi;

    const patterns = [HEX_REGEX, RGB_REGEX, HSL_REGEX];

    if (typeof expectation !== "object" || !expectation) return;

    root.walkDecls(declaration => {
      const { value } = declaration;
      const colors = patterns.reduce((acc, c) => {
        const matches = value.match(c);
        if (matches && matches.length > 0) {
          const colors = matches.map(m => color(m).hex());
          acc.push(...colors);
        }

        return acc;
      }, []);

      const lookUpObject = Object.entries(expectation).reduce(
        (acc, [key, value]) => {
          acc[value.toUpperCase()] = key;

          return acc;
        },
        {}
      );

      const results = colors.map(c => ({
        valid: !lookUpObject[c],
        used: c,
        suggested: lookUpObject[c] || null
      }));

      const failedColors = results.filter(res => !res.valid);

      if (failedColors.length) {
        stylelint.utils.report({
          message: messages.expected(failedColors),
          node: declaration,
          result,
          ruleName
        });
      }

      console.log(context.fix);
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = {
  rule,
  ruleName,
  messages
};
