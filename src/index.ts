import { createPlugin } from "stylelint";
import rules from "./rules";

export default [createPlugin("rule1", rules)];
