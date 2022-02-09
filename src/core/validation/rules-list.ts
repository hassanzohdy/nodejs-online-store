import EmailRule from "./rules/email";
import MinLengthRule from "./rules/min-length";
import RequiredRule from "./rules/required";

export const rulesList = {
  [EmailRule.rule]: EmailRule,
  [RequiredRule.rule]: RequiredRule,
  [MinLengthRule.rule]: MinLengthRule,
};
