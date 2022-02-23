import InRule from "./rules/in";
import MaxRule from "./rules/max";
import MinRule from "./rules/min";
import EmailRule from "./rules/email";
import LengthRule from "./rules/length";
import UniqueRule from "./rules/unique";
import ExistsRule from "./rules/exists";
import RequiredRule from "./rules/required";
import MaxLengthRule from "./rules/max-length";
import MinLengthRule from "./rules/min-length";
import ConfirmedRule from "./rules/confirmed";
import ImageRule from "./rules/image";
import ExtensionRule from "./rules/extension";
import BooleanRule from "./rules/boolean";
import CheckboxRule from "./rules/checkbox";

export const rulesList = {
  [InRule.rule]: InRule,
  [MinRule.rule]: MinRule,
  [MaxRule.rule]: MaxRule,
  [EmailRule.rule]: EmailRule,
  [ImageRule.rule]: ImageRule,
  [LengthRule.rule]: LengthRule,
  [UniqueRule.rule]: UniqueRule,
  [ExistsRule.rule]: ExistsRule,
  [RequiredRule.rule]: RequiredRule,
  [MinLengthRule.rule]: MinLengthRule,
  [MaxLengthRule.rule]: MaxLengthRule,
  [ConfirmedRule.rule]: ConfirmedRule,
  [ExtensionRule.rule]: ExtensionRule,
  // an alias
  bool: BooleanRule,
  [BooleanRule.rule]: BooleanRule,
  [CheckboxRule.rule]: CheckboxRule,
};
