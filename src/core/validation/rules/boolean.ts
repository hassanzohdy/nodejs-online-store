import ExtensionRule from "./extension";
import InRule from "./in";

export default class BooleanRule extends InRule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "boolean";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    this.options = [true, false];
    super.beforeValidating();
  }
}
