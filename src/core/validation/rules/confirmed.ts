import Rule from "./rule";
import request from "core/http/request";

export default class ConfirmedRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "confirmed";

  /**
   * Matching password input
   */
  private matchingPasswordInput: string = "confirmPassword";

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    if (this.options[0]) {
      this.matchingPasswordInput = this.options[0];
    }

    this.isValid = this.value === request.input(this.matchingPasswordInput);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input is not matched with :confirmingAttribute.`, {
      confirmingAttribute: this.matchingPasswordInput,
    });
  }
}
