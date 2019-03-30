const { rule, messages, ruleName } = require("../index");

testRule(rule, {
  ruleName,
  config: [
    {
      "@snowWhite": "#f4f5e2"
    }
  ],
  fix: true,

  accept: [
    {
      code: "a { color: @snowWhite; }",
      description: "Variables are OK"
    },
    {
      code: "a { font-size: 3rem; }",
      description: "No variable is OK"
    }
  ],

  reject: [
    {
      code: "a { color: #f4f5e2; }",
      fixed: "a { color: @snowWhite; }",
      description: "Variables should be used",
      message:
        'Colour "#f4f5e2" should be "@snowWhite". (@productboardlabs/rule1)',
      line: 1
    },
    {
      code: "a { background: rgb(244, 245, 226); }",
      fixed: "a { background: @snowWhite; }",
      description: "Variables should be used",
      message:
        'Colour "rgb(244, 245, 226)" should be "@snowWhite". (@productboardlabs/rule1)',
      line: 1
    }
  ]
});