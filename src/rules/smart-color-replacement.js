const stylelint = require("stylelint");
const color = require("color");

const HEX_REGEX = /(#[a-f0-9]{3,6})/gi;
const RGB_REGEX = /(rgb|rgba)\([^\)]*\)/gi;
const HSL_REGEX = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/gi;

const ruleName = "@productboard/smart-color-replacement";
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: failedColors =>
    failedColors
      .map(({ used, suggested }) => `Color "${used}" should be "${suggested}".`)
      .join(" ")
});

const rule = function(expectation, _, context) {
  return (root, result) => {
    if (typeof expectation !== "object" || !expectation) return;

    const lookUpObject = Object.entries(expectation).reduce(
      (acc, [key, value]) => {
        acc[value.toUpperCase()] = key;

        return acc;
      },
      {}
    );

    const patterns = [HEX_REGEX, RGB_REGEX, HSL_REGEX];

    root.walkDecls(declaration => {
      const { value } = declaration;
      const colors = patterns.reduce((acc, c) => {
        const matches = value.match(c);
        if (matches && matches.length > 0) {
          acc.push(...matches);
        }

        return acc;
      }, []);

      const results = colors.map(used => {
        const sanitized = color(used).hex();
        return {
          valid: !lookUpObject[sanitized],
          suggested: lookUpObject[sanitized],
          used
        };
      });

      const failedColors = results.filter(res => !res.valid);

      if (failedColors.length) {
        stylelint.utils.report({
          message: messages.expected(failedColors),
          node: declaration,
          result,
          ruleName
        });

        if (context.fix) {
          failedColors.forEach(({ used, suggested }) => {
            declaration.value = declaration.value.replace(used, suggested);
          });
        }
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;
