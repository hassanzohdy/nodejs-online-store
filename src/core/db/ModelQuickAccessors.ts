import database from "./database";
import { modelsList } from "./models";

export default class ModelQuickAccessors<T> {
  /**
   * {@inheritDoc}
   */
  public static collection: string = "users";

  /**
   * Get query builder
   */
  public static get query() {
    return database.query(this.collection);
  }

  /**
   * Find Record by id and return new instance of model
   */
  public static async find<T>(
    id: number
  ): Promise<ModelQuickAccessors<T> | null> {
    const record = await this.query.first({
      id,
    });

    if (!record) return null;

    return new modelsList[this.collection](record as T);
  }

  /**
   * Find list of records based on the given filter and return list of models
   */
  public static async list<T>(attributes: any = {}): Promise<T[]> {
    const records = await this.query.list(attributes);

    if (!records) return [];

    return records.map((record) => new modelsList[this.collection](record));
  }
}
