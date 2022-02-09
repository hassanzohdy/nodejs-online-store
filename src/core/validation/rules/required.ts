import Rule from "./rule";
import Is from "@mongez/supportive-is";

export default class RequiredRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "required";

  /**
   * {@inheritdoc}
   */
  protected requiresValue: boolean = false;

  /**
   * {@inheritdoc}
   */
  public validateRule(): void {
    this.isValid = !Is.empty(this.value);
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input is required`);
  }
}
