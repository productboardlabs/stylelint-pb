const stylelint = require("stylelint");
const color = require("color");

const HEX_REGEX = /(#[a-f0-9]{3,6})/gi;
const RGB_REGEX = /rgb\([^\)]*\)/gi;
const HSL_REGEX = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/gi;

const ruleName = "@productboard/smart-color-replacement";

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: failedColors =>
    failedColors
      .map(({ used, suggested }) => `Color "${used}" should be "${suggested}".`)
      .join(" ")
});

const rule = function(configuration, { strictMode = false } = {}, context) {
  return (root, result) => {
    if (typeof configuration !== "object" || !configuration) return;

    const lookUpObject = Object.entries(configuration).reduce(
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

      const results = colors.reduce((acc, v, i) => {
        let sanitized;
        try {
          sanitized = color(v).hex();
        } catch (e) {
          // ignore non-parsable colors
          return acc;
        }

        acc.push({
          valid: lookUpObject[sanitized]
            ? !lookUpObject[sanitized]
            : !strictMode,
          suggested: lookUpObject[sanitized],
          used: v
        });

        return acc;
      }, []);

      const failedColors = results.filter(({ valid }) => !valid);

      if (failedColors.length) {
        stylelint.utils.report({
          message: messages.expected(failedColors),
          node: declaration,
          result,
          ruleName
        });

        if (context.fix) {
          failedColors
            .filter(({ suggested }) => suggested)
            .forEach(({ used, suggested }) => {
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
