export type RuleError = {
  rule: string;
  message: string;
};

export type InputError = {
  input: string;
  errors: RuleError[];
};
