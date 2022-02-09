import Is from "@mongez/supportive-is";
import chalk from "chalk";
import Rule from "./rule";

export default class InRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "in";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (Is.empty(this.options)) {
      throw new Error(
        `${chalk.blue("in")}: rule requires at least one value for validation.`
      );
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = this.options.includes(this.value);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input must be one of the following types: :options`);
  }
}
