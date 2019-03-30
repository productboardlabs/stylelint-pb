module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "js"],
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
