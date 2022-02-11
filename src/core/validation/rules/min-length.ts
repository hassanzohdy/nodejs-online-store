import { UploadedFileList } from "core/http/UploadedFile";
import LengthRule from "./length";

export default class MinLengthRule extends LengthRule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "minLength";

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    if (this.value instanceof UploadedFileList) {
      this.isValid = this.value.length >= this.length;
    } else {
      this.isValid = String(this.value).length >= this.length;
    }
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    if (this.value instanceof UploadedFileList) {
      return this.message(`Uploaded :input must be :options[0] or more.`);
    }

    return this.message(
      `:input'length must be :options[0] characters or more.`
    );
  }
}
