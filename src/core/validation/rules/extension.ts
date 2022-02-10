import chalk from "chalk";
import Rule from "./rule";

export default class ExtensionRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "ext";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (this.options.length === 0) {
      throw new Error(
        `${chalk.blue(
          "ext"
        )} rule needs at least one extension to be passed in the options list.`
      );
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = this.options.includes(this.value.extension);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(
      `:input has no supported extension, supported extension are: :options`
    );
  }
}
