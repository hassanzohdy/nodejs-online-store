import Rule from "./rule";
import Is from "@mongez/supportive-is";

export default class EmailRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "email";

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    this.isValid = Is.email(this.value);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input is not a valid email address`);
  }
}
