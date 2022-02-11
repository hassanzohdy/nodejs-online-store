import { UploadedFileList } from "core/http/UploadedFile";
import LengthRule from "./length";
import Rule from "./rule";

export default class MaxLengthRule extends LengthRule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "maxLength";

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    if (this.value instanceof UploadedFileList) {
      this.isValid = this.value.length <= this.length;
    } else {
      this.isValid = String(this.value).length <= this.length;
    }
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    if (this.value instanceof UploadedFileList) {
      return this.message(`Uploaded :input can not be more than :options[0].`);
    }

    return this.message(
      `:input'length must be equal to or less than :options[0] characters.`
    );
  }
}
