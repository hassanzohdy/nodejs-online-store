import database from "../index";
import Model from "../model";
import { BaseSchema } from "../types";

export type MigrationSchema = BaseSchema & {
  hash: string;
  name: string;
  collection: string;
  operations: any;
};

export default class Migration<MigrationSchema> extends Model<MigrationSchema> {
  /**
   * {@inheritDoc}
   */
  public static collection: string = "migrations";
}

database.defineModel(Migration.collection, Migration);
