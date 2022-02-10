import ExtensionRule from "./extension";

export default class ImageRule extends ExtensionRule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "image";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    this.options = [
      "apng",
      "avif",
      "jpg",
      "jpeg",
      "png",
      "svg",
      "bmp",
      "gif",
      "webp",
      "ico",
      "fav",
      "tiff",
    ];
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input is not a valid image`);
  }
}
