import * as stylelint from "stylelint";
import * as color from "color";

export const ruleName = "color-hex-case";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Error"
});

interface Declaration {
  value: string;
  prop: string;
}

const rule = function(expectation: unknown, options, context) {
  return (root, result) => {
    const HEX_REGEX = /(#[a-f0-9]{3,6})/gi;
    const RGB_REGEX = /(rgb|rgba)\([^\)]*\)/gi;
    const HSL_REGEX = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/gi;

    const patterns: RegExp[] = [HEX_REGEX, RGB_REGEX, HSL_REGEX];

    if (typeof expectation !== "object" || !expectation) return;

    root.walkDecls((declaration: any) => {
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

      //   colors.forEach(color => {
      //     color === color();
      //   });
      console.log("debug", colors);

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

      const isError = results.some(r => !r.valid);

      if (isError) {
        stylelint.utils.report({
          message: "You are a bad variable user",
          node: declaration,
          result,
          ruleName
        });
      }
      console.log("car", isError);
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default rule;
