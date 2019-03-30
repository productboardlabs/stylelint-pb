test("a", () => {
  expect("a").toBe("a");
});

// import rule from "../index";
// const { messages, ruleName } = rule;

// testRule(rule, {
//   ruleName,
//   config: [
//     {
//       snowWhite: "#f4f5e2"
//     }
//   ],
//   fix: true,

//   accept: [
//     {
//       code: "a { color: @snowWhite; }",
//       description: "Variables are OK"
//     },
//     {
//       code: "a { font-size: 3rem; }",
//       description: "No variable is OK"
//     }
//   ],

//   reject: [
//     {
//       code: "a { color: #f4f5e2; }",
//       fixed: "a { color: @snowWhite; }",
//       description: "Variables should be used",
//       message: "You are a bad variable user",
//       line: 1
//     }
//   ]
// });
