import database from "core/db";
import { BaseSchema } from "core/db/types";
import BasModel, { ModelInterface } from "core/db/model";

export type CategorySchema = BaseSchema & {
  name: string;
};

export default class Category<CategorySchema>
  extends BasModel<CategorySchema>
  implements ModelInterface<CategorySchema>
{
  /**
   * {@inheritDoc}
   */
  public static collection: string = "categories";

  /**
   * {@inheritDoc}
   */
  public get sharedData(): any {
    return this.only("id", "email", "name");
  }
}

database.defineModel(Category.collection, Category);
