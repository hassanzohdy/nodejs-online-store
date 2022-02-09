import Rule from "./rule";

export default class MaxLengthRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "maxLength";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(
        `maxLength rule requires the max length number for validation.`
      );
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = String(this.value).length <= Number(this.options[0]);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(
      `:input must be less than or equal to :options[0] characters.`
    );
  }
}
