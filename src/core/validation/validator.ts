import request from "../http/request";
import MessageBag from "./MessageBag";
import Is from "@mongez/supportive-is";
import RequiredRule from "./rules/required";
import { InputError, RuleError } from "./types";
import { DynamicObject } from "utils/types";
import { rulesList } from "./rules-list";
import cast from "utils/cast";
import chalk from "chalk";

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
   * Determine whether the validator has run the scan
   */
  public isScanned: boolean = false;

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
   * Set error messages to override default errors
   */
  public messages(errorMessages: any): Validator {
    this.errorMessages = errorMessages;
    return this;
  }

  /**
   * Set input names replacements
   */
  public attributes(inputNames: DynamicObject): Validator {
    this.inputNamesReplacements = inputNames;
    return this;
  }

  /**
   * Set the rules list
   */
  public rules(rules: any): Validator {
    this.inputs = rules;
    return this;
  }

  /**
   * Start validating
   */
  public async diagnose(): Promise<Validator> {
    if (this.isScanned) return this;

    this.errorsList = [];

    for (let input in this.inputs) {
      let rules: any = this.inputs[input];
      await this.validateInput(input, rules);
    }

    this.isScanned = true;

    return this;
  }

  /**
   * @alias diagnose
   */
  public scan() {
    return this.diagnose();
  }

  /**
   * Validate the given input and its rules
   */
  private async validateInput(input: string, rules: any): Promise<void> {
    const inputError: RuleError[] = [];

    if (Is.string(rules)) {
      rules = rules.split("|");
    }

    // the bail rule name will tell the validator to stop validating after the first failure of the attributes
    const validateAllAttributes: boolean = rules.includes("bail");

    for (let rule of rules) {
      if (rule === "bail") continue;

      if (Is.string(rule)) {
        rule = rule.split(":");
      }

      const [ruleName, ...options] = rule;

      if (!rulesList[ruleName]) {
        throw new Error(
          `Invalid ${chalk.redBright(
            ruleName
          )} rule, allowed rules are: ${chalk.green(
            Object.keys(this.rulesList).join("|")
          )}`
        );
      }

      rule = new this.rulesList[ruleName]();

      // cast the value as it will be coming from string
      rule.setOptions(options.map(cast));

      await rule
        .setInput(input)
        .setInputName(this.inputNamesReplacements[input] || input)
        .setValue(request.input(input))
        .validate();

      if (rule.fails) {
        let messageOverrides =
          this.errorMessages[`${input}.${rule.name}`] ||
          this.errorMessages[rule.name];
        if (messageOverrides) {
          rule.overrideMessage(messageOverrides);
        }

        inputError.push({
          rule: rule.name,
          message: rule.errorMessage,
        });

        if (validateAllAttributes === false) break;
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
  public get passes(): boolean {
    return this.errorsList.length === 0;
  }

  /**
   * Get inputs list
   */
  public get inputsList(): string[] {
    return Object.keys(this.inputs);
  }

  /**
   * Determine if validation has failed
   */
  public get fails(): boolean {
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
