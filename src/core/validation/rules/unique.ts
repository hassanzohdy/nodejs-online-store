import chalk from "chalk";
import database from "../../db";
import Rule from "./rule";

export default class UniqueRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "unique";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(
        `${chalk.blue(
          "unique"
        )} rule requires at least table name for validation.`
      );
    }
  }

  /**
   * {@inheritdoc}
   */
  protected async validateRule(): Promise<void> {
    const [
      collection,
      searchingColumn = this.input,
      ignoringValue = null,
      ignoringColumn = "id",
    ] = this.options;

    const query = database
      .query(collection)
      .aggregate.where(searchingColumn, this.value);

    if (ignoringValue) {
      query.where(ignoringColumn, "!=", ignoringValue);
    }

    this.isValid = (await query.first()) === null;
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input already exists.`);
  }
}
