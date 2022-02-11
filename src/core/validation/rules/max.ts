import splitByNumber, { stringSize } from "utils/string-with-number";
import UploadedFile, { UploadedFileList } from "core/http/UploadedFile";
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
    if (this.value instanceof UploadedFileList) {
      const [size, type] = stringSize(this.options[0]);
      for (let file of this.value) {
        this.isValid = file.size(type) <= size;
        if (this.isValid === false) break;
      }
    } else if (this.value instanceof UploadedFile) {
      const [size, type] = stringSize(this.options[0]);

      this.isValid = this.value.size(type) <= size;
    } else {
      this.isValid = Number(this.value) <= Number(this.options[0]);
    }
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input must be equal to or less than :options[0].`);
  }
}
