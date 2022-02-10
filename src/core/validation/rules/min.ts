import UploadedFile from "../../http/UploadedFile";
import Rule from "./rule";

export default class MinRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "min";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(`min rule requires the min value for validation.`);
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    if (this.value instanceof UploadedFile) {
      const [size, type] = this.options[0].match(/[\d\.]+|\D+/g);

      this.isValid = this.value.size(type.toLocaleLowerCase()) >= Number(size);
    } else {
      this.isValid = Number(this.value) >= Number(this.options[0]);
    }
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input must be at least :options[0].`);
  }
}
