import * as testRule from "stylelint-test-rule-tape";
import rule from "../index";
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [
    {
      snowWhite: "#f4f5e2"
    }
  ],
  fix: true,

  accept: [
    {
      code: "a { color: @snowWhite; }"
    },
    {
      code: "a { font-size: 3rem; }"
    }
  ],

  reject: [
    {
      code: "a { color: #f4f5e2; }",
      fixed: "a { color: @snowWhite; }",

      message: "You are a bad variable user",
      line: 1
    }
  ]
});
