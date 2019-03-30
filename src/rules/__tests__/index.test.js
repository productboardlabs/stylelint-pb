const { rule, messages, ruleName } = require("../index");

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
        'Colour "#F4F5E2" should be "snowWhite". (@productboardlabs/rule1)',
      line: 1
    }
  ]
});
