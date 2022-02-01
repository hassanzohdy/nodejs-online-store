import { DynamicObject } from "utils/types";
import database from ".";
import databaseManager from "./DatabaseManager";
import { modelsList } from "./models";
import QueryBuilder from "./QueryBuilder";
import { BaseSchema } from "./types";

function proxy<T>(object: any, handler: any): T {
  return new Proxy(object, handler);
}

export default abstract class Model<Schema> {
  /**
   * Dynamic call for attributes
   */
  [key: string]: any;
  /**
   * Model attributes
   */
  public attributes: any = {};

  /**
   * {@inheritDoc}
   */
  public static collection: string = "users";

  /**
   * Constructor
   */
  public constructor(attributes: Schema = {} as Schema) {
    this.attributes = attributes;

    /**
     * Constructor
     */
    this.attributes = { ...attributes };
    return proxy<Model<Schema>>(this, {
      set: (model: any, name: string, value: any): boolean => {
        model.attributes[name] = value;
        return true;
      },
      get: (model: any, key: string): any => {
        return (model as any)[key] || this.attributes[key];
      },
      deleteProperty: (model: any, key: any): boolean => {
        if (key in model) {
          delete (model as any)[key];
        } else {
          delete model.attributes[key];
        }

        return true;
      },
    });
  }

  /**
   * Merge the given attributes to current attributes
   */
  public setAttributes<T>(attributes: T): Model<Schema> {
    this.attributes = { ...this.attributes, ...attributes };

    return this;
  }

  /**
   * Save data into database
   */
  public async save(): Promise<any> {
    if (this.id) {
      this.updatedAt = new Date();
      return await Model.query.update({ id: this.id }, this.attributes);
    }
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.id = databaseManager.newId(Model.collection);
    return await Model.query.insert(this.attributes);
  }

  /**
   * Find Record by id and return new instance of model
   */
  public static async find<T>(id: number): Promise<Model<T> | null> {
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

  /**
   * Get query builder
   */
  public static get query() {
    return database.query(this.collection);
  }
}
