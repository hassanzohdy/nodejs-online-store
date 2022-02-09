import Is from "@mongez/supportive-is";

export default class Rule {
  /**
   * Public rule name
   */
  public static rule: string;
  /**
   * {@inheritdoc}
   */
  protected requiresValue: boolean = true;

  /**
   * Input name
   */
  public input!: string;

  /**
   * Input name that will be displayed in the error message
   */
  private inputName!: string;

  /**
   * Input value
   */
  public value!: any;

  /**
   * Rule options
   */
  public options: any[] = [];

  /**
   * Rule validation flag
   */
  public isValid: boolean = true;

  /**
   * Rule name
   */
  public get name(): string {
    const childClass = <typeof Rule>this.constructor;

    return childClass["rule"];
  }

  /**
   * Set rule options
   */
  public setOptions(options: any[]): Rule {
    this.options = options;
    return this;
  }

  /**
   * Set input's value
   */
  public setValue(value: any): Rule {
    this.value = value;
    return this;
  }

  /**
   * Set input
   */
  public setInput(input: string): Rule {
    this.input = input;
    return this;
  }

  /**
   * Set input name
   */
  public setInputName(input: string): Rule {
    this.inputName = input;
    return this;
  }

  /**
   * Get error message
   */
  public message(message: string): string {
    return message
      .replace(":input", this.inputName || this.input)
      .replace(":options[0]", this.options[0]);
  }

  /**
   * Start validating the rule
   */
  public validate(): Rule {
    this.beforeValidating();
    if (this.requiresValue && Is.empty(this.value)) return this;

    this.validateRule();

    return this;
  }

  /**
   * Useful to make any checks in the child rule, such as the developer forgot to set the rule options
   */
  protected beforeValidating(): void {}

  /**
   * Validate the extended rule
   */
  protected validateRule(): void {}

  /**
   * Get error message
   */
  public get errorMessage(): string {
    return "";
  }
}
