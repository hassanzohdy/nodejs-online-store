import Rule from "./rule";

export default class MaxRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "max";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(`max rule requires the max value for validation.`);
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = Number(this.value) <= Number(this.options[0]);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input must be at least :options[0].`);
  }
}
