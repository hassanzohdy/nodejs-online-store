import chalk from "chalk";
import Rule from "./rule";
import { UploadedFileList } from "core/http/UploadedFile";

export default class ExtensionRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "ext";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (this.options.length === 0) {
      throw new Error(
        `${chalk.blue(
          "ext"
        )} rule needs at least one extension to be passed in the options list.`
      );
    }
  }

  /**
   * {@inheritdoc}
   */
  protected validateRule(): void {
    if (this.value instanceof UploadedFileList) {
      for (let file of this.value) {
        this.isValid = this.options.includes(file.extension);

        if (this.isValid === false) break;
      }
    } else {
      this.isValid = this.options.includes(this.value.extension);
    }
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(
      `:input has no supported extension, supported extension are: :options`
    );
  }
}
