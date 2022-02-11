import chalk from "chalk";
import { UploadedFileList } from "core/http/UploadedFile";
import Rule from "./rule";

export default class LengthRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "length";
  /**
   * Length value
   */
  protected length: number = 0;

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(
        `${chalk.blue(
          this.name
        )} rule requires the length number for validation.`
      );
    }

    this.length = Number(this.options[0]);
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    if (this.value instanceof UploadedFileList) {
      this.isValid = this.value.length === this.length;
    } else {
      this.isValid = String(this.value).length === this.length;
    }
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    if (this.value instanceof UploadedFileList) {
      return this.message(`Uploaded :input must be :options[0].`);
    }

    return this.message(`:input must be :options[0] characters.`);
  }
}
