import { InputError } from "./types";

export default class MessageBag {
  /**
   * Error return mode
   */
  private returnMode: "all" | "first" = "first";
  /**
   * Construct the message bag and define the errors list
   */
  public constructor(private errors: InputError[] = []) {}

  /**
   * A flag to define the error will return only the first error
   */
  public get firstOnly(): MessageBag {
    this.returnMode = "first";
    return this;
  }

  /**
   * A flag to define the error will return all errors
   */
  public get all(): MessageBag {
    this.returnMode = "all";
    return this;
  }

  /**
   * Get errors as object
   */
  public toObject() {
    let errors: any = {};
    for (let error of this.errors) {
      errors[error.input] =
        this.returnMode == "first"
          ? error.errors[0].message
          : error.errors.map((rule) => rule.message);
    }

    return errors;
  }

  /**
   * Get errors as an array of errors
   */
  public toArray() {
    let errors: any[] = [];

    for (let error of this.errors) {
      errors.push({
        key: error.input,
        error:
          this.returnMode === "first"
            ? error.errors[0].message
            : error.errors.map((rule) => rule.message),
      });
    }

    return errors;
  }

  /**
   * Get the entire errors list
   */
  public errorsList(): InputError[] {
    return this.errors;
  }
}
