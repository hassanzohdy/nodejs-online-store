import Rule from "./rule";

export default class MinLengthRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "minLength";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(
        `minLength rule requires the min length number for validation.`
      );
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = String(this.value).length >= Number(this.options[0]);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(
      `:input must be at least :options[0] characters or more.`
    );
  }
}
