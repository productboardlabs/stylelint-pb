const rule = require("../smart-color-replacement");

testRule(rule, {
  ruleName: rule.ruleName,
  config: [
    {
      "@snowWhite": "#f4f5e2"
    }
  ],
  fix: true,

  accept: [
    {
      code: "",
      description: "empty stylesheet"
    },
    {
      code: "a {}",
      description: "empty rule"
    },
    {
      code: '@import "foo.css";',
      description: "blockless statement"
    },
    {
      code: ":global {}",
      description: "CSS Modules global empty rule set"
    },
    {
      code: "a { color: @snowWhite; }",
      description: "Usage of correct variable"
    },
    {
      code: "a { font-size: 3rem; }",
      description: "No color usage should be ignored"
    },
    {
      code: "a { color: #333333; }",
      description: "Color out of the config should be ignored by default"
    }
  ],

  reject: [
    {
      code: "a { color: #f4f5e2; }",
      fixed: "a { color: @snowWhite; }",
      description: "Should use correct variable not hexadecimal notation",
      message: rule.messages.expected([
        {
          used: "#f4f5e2",
          suggested: "@snowWhite"
        }
      ]),
      line: 1
    },
    {
      code: "a { background: rgb(244, 245, 226); }",
      fixed: "a { background: @snowWhite; }",
      description: "Should use correct variable not rgb notation",
      message: rule.messages.expected([
        {
          used: "rgb(244, 245, 226)",
          suggested: "@snowWhite"
        }
      ]),
      line: 1
    }
  ]
});

testRule(rule, {
  ruleName: rule.ruleName,
  fix: true,

  accept: [
    {
      code: "a { font-size: 3rem; }",
      description: "Should do nothing without config"
    }
  ]
});

testRule(rule, {
  ruleName: rule.ruleName,
  config: [
    {
      "@snowWhite": "#f4f5e2"
    },
    "strictMode"
  ],
  fix: true,

  reject: [
    {
      code: "a { color: #333333; }",
      fixed: "a { color: #333333; }",
      description: "Any color except variables is prohibited!"
    }
  ]
});
