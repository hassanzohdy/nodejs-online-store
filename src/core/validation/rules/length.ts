import Rule from "./rule";

export default class LengthRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "length";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(`length rule requires the length number for validation.`);
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = String(this.value).length === Number(this.options[0]);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input must be :options[0] characters.`);
  }
}
