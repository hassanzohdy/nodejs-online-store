import chalk from "chalk";
import cast from "utils/cast";
import database from "../../db";
import Rule from "./rule";

export default class ExistsRule extends Rule {
  /**
   * {@inheritdoc}
   */
  public static rule: string = "exists";

  /**
   * {@inheritdoc}
   */
  protected beforeValidating(): void {
    if (typeof this.options[0] === "undefined") {
      throw new Error(
        `${chalk.blue(
          "exists"
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
      query.where(ignoringColumn, "!=", cast(ignoringValue));
    }

    const document = await query.first();

    this.isValid = document !== null;
  }

  /**
   * {@inheritdoc}
   */
  public get errorMessage(): string {
    return this.message(`:input does not exit in our records.`);
  }
}
