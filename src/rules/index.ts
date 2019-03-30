import * as stylelint from "stylelint";
import * as postcss from "postcss";
import * as color from "color";

export const ruleName = "rule1";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Error"
});

const rule = function(expectation: unknown, _, context) {
  return (root, result) => {
    const HEX_REGEX = /(#[a-f0-9]{3,6})/gi;
    const RGB_REGEX = /(rgb|rgba)\([^\)]*\)/gi;
    const HSL_REGEX = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/gi;

    const patterns: RegExp[] = [HEX_REGEX, RGB_REGEX, HSL_REGEX];

    if (typeof expectation !== "object" || !expectation) return;

    root.walkDecls((declaration: postcss.Declaration) => {
      const { value } = declaration;
      const colors = patterns.reduce(
        (acc, c) => {
          const matches = value.match(c);
          if (matches && matches.length > 0) {
            const colors = matches.map(m => color(m).hex());
            acc.push(...colors);
          }

          return acc;
        },
        [] as Array<string>
      );

      const lookUpObject = Object.entries(expectation).reduce(
        (acc, [key, value]) => {
          acc[value.toUpperCase()] = key;

          return acc;
        },
        {} as { [key: string]: string }
      );

      const results = colors.map(c => ({
        valid: !lookUpObject[c],
        used: c,
        suggested: lookUpObject[c] || null
      }));

      const isError = results.some(res => !res.valid);

      if (isError) {
        stylelint.utils.report({
          message: messages.expected,
          node: declaration,
          result,
          ruleName
        });
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default rule;
