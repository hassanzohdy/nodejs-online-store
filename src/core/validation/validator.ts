import request from "../http/request";
import MessageBag from "./MessageBag";
import Is from "@mongez/supportive-is";
import RequiredRule from "./rules/required";
import { InputError, RuleError } from "./types";
import { DynamicObject } from "utils/types";
import { rulesList } from "./rules-list";
import cast from "utils/cast";

export default class Validator {
  /**
   * Inputs that will be validated
   */
  public inputs: any = {};

  /**
   * Errors list
   */
  private errorsList: InputError[] = [];

  /**
   * Rules list
   */
  private rulesList: any = rulesList;

  /**
   * Error messages
   */
  private errorMessages: any = {};

  /**
   * Input names replacements in the error messages
   */
  private inputNamesReplacements: DynamicObject = {};

  /**
   * Set rules list
   */
  public setRulesList(rulesList: any): Validator {
    this.rulesList = rulesList;
    return this;
  }

  /**
   * Set input names replacements
   */
  public setInputNames(inputNames: DynamicObject): Validator {
    this.inputNamesReplacements = inputNames;
    return this;
  }

  /**
   * Set the rules list
   */
  public rules(rules: any): Validator {
    for (let input in rules) {
      this.inputs[input] = {
        rules: rules[input],
      };
    }

    return this;
  }

  /**
   * Start validating
   */
  public diagnose(): Validator {
    this.errorsList = [];

    for (let input in this.inputs) {
      let rules: any = this.inputs[input];
      this.validateInput(input, rules);
    }

    return this;
  }

  /**
   * @alias diagnose
   */
  public scan(): Validator {
    return this.diagnose();
  }

  /**
   * Validate the given input and its rules
   */
  private validateInput(input: string, rules: any): void {
    const inputError: RuleError[] = [];

    if (Is.string(rules)) {
      rules = rules.split("|");
    }

    for (let rule of rules) {
      if (Is.string(rule)) {
        rule = rule.split(":");
        const [ruleName, ...options] = rules;

        if (!new rulesList[ruleName]()) {
          throw new Error(
            `Invalid ${ruleName} rule, allowed rules are: ${Object.keys(
              this.rulesList
            ).join("|")}`
          );
        }

        rule = new this.rulesList[ruleName]();

        // cast the value as it will be coming from string
        rule.setOptions(options.map(cast));
      }

      rule
        .setInput(input)
        .setInputName(this.inputNamesReplacements[input] || input)
        .setValue(request.input(input))
        .validate();

      if (rule.isValid === false) {
        inputError.push({
          rule: rule.name,
          message:
            this.errorMessages[`${input}.${rule.name}`] ||
            this.errorMessages[rule.name] ||
            rule.errorMessage,
        });
      }
    }

    if (inputError.length > 0) {
      this.errorsList.push({
        input,
        errors: inputError,
      });
    }
  }

  /**
   * Check if the validation passes
   */
  public passes(): boolean {
    return this.errorsList.length === 0;
  }

  /**
   * Determine if validation has failed
   */
  public fails(): boolean {
    return this.errorsList.length > 0;
  }

  /**
   * Get errors list
   */
  public get errors(): MessageBag {
    return new MessageBag(this.errorsList);
  }
}

function rules() {
  return {
    name: "required|unique:users|minLength:8",
    image: "required|image",
    password: "required|confirmed",
    age: "min:18",
    email: "email|exists:users",
    "options.*.name": "required",
  } as any;
}
