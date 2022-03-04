import InRule from "./in";

export default class CheckboxRule extends InRule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "checkbox";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    this.options = [true, false, 1, "On", "on"];
    super.beforeValidating();
  }
}
