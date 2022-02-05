import { log } from "../log";
import { now } from "utils/date";
import database from "./database";
import { newModel } from "./models";
import Aggregate from "./aggregate";
import applyMixins from "utils/mixins";
import { DynamicObject } from "utils/types";
import { Obj } from "@mongez/reinforcements";
import ModelAttributes from "./ModelAttributes";
import databaseManager from "./DatabaseManager";
import collect, { Collection } from "collect.js";
import events, { EventSubscription } from "@mongez/events";
import { AttributesCasts, ModelEventName } from "./types";

abstract class BaseModel<Schema> {
  /**
   * Original attributes
   */
  public originalAttributes: any = {};

  /**
   * Dynamic call for attributes
   */
  [attribute: string]: any;

  /**
   * {@inheritDoc}
   */
  public static collection: string;

  /**
   * Original attributes data
   */

  /**
   * Default casts list
   */
  protected defaultCasts: AttributesCasts = {
    id: "int",
    createdAt: "date",
    updatedAt: "date",
  };

  /**
   * Casts Types
   */
  protected casts: AttributesCasts = {};

  /**
   * Constructor
   */
  public constructor(attributes = {} as Schema) {
    this.originalAttributes = Obj.clone(attributes as any);

    /**
     * Constructor
     */
    this.attributes = this.prepareAttributes(attributes);

    return new Proxy<BaseModel<Schema>>(this, {
      set: (model: any, name: string, value: any): boolean => {
        if (model[name]) {
          model[name] = value;
        } else {
          model.attributes[name] = value;
        }
        return true;
      },
      get: (model: any, attribute: string): any => {
        if (model[attribute] !== undefined) return model[attribute];

        return this.castAttribute(attribute);
      },
      deleteProperty: (model: any, attribute: any): boolean => {
        if (attribute in model) {
          delete (model as any)[attribute];
        } else {
          delete model.attributes[attribute];
        }

        return true;
      },
    });
  }

  /**
   * Save data into database
   */
  public async save(newAttributes: any = {}): Promise<any> {
    if (this.id) {
      return this.update(newAttributes);
    }

    return this.insert(newAttributes);
  }

  /**
   * Create new record
   */
  public static async create<T>(data: T): Promise<BaseModel<T>> {
    return await newModel(this.collection, data).save();
  }

  /**
   * Insert new record
   */
  public async insert(newAttributes: any = {}): Promise<BaseModel<Schema>> {
    BaseModel.trigger(this.collection, "creating", this);
    BaseModel.trigger(this.collection, "saving", this, "create");

    this.createdAt = now();
    this.updatedAt = this.createdAt;
    this.setAttributes(newAttributes);

    if (!this.id) {
      this.id = await databaseManager.newId(this.collection);
    }

    const data: any = await this.query.insert(
      this.castAttributesIn(this.attributes)
    );

    this._id = data.insertedId;

    BaseModel.trigger(this.collection, "create", this);
    BaseModel.trigger(this.collection, "save", this, "create");

    return this;
  }

  /**
   * Update data
   */
  public async update(newAttributes: any = {}): Promise<any> {
    this.setAttributes(newAttributes);

    if (this.isDirty() === false) return this;

    BaseModel.trigger(this.collection, "updating", this);
    BaseModel.trigger(this.collection, "saving", this, "update");

    this.updatedAt = now();

    const result = await this.query.update(
      { id: this.id },
      {
        $set: {
          ...this.castAttributesIn(this.attributes),
        },
      }
    );

    BaseModel.trigger(
      this.collection,
      "update",
      this,
      this.originalAttributes,
      result
    );
    BaseModel.trigger(
      this.collection,
      "save",
      this,
      "update",
      this.originalAttributes,
      result
    );

    return result;
  }

  /**
   * Determine if the attributes have been modified
   */
  public isDirty(): boolean {
    return (
      JSON.stringify(this.originalAttributes) !==
      JSON.stringify(this.attributes)
    );
  }

  /**
   * Delete current model record
   */
  public async delete(): Promise<any> {
    if (!this.id) return null;

    BaseModel.trigger(this.collection, "deleting", this);

    let result = await BaseModel.delete(this.id);

    BaseModel.trigger(this.collection, "delete", this, result);

    return result;
  }

  /**
   * Find Record by id and return new instance of model
   */
  public static async find<T>(id: number): Promise<BaseModel<T> | null> {
    const record = await this.query.first({
      id,
    });

    if (!record) return null;

    return newModel(this.collection, record);
  }

  /**
   * Get first matched value for the given options
   */
  public static async first<T>(options: any = {}) {
    return (await this.list<T>(options)).first();
  }

  /**
   * Find list of records based on the given filter and return list of models
   */
  public static async list<T>(attributes: any = {}): Promise<Collection<T>> {
    BaseModel.trigger(this.collection, "fetching", attributes);

    const records: any[] = await this.query.list(attributes);

    if (!records) return collect<any>([]);

    let recordsList = collect<T>(
      records.map((record) => newModel(this.collection, record))
    );

    BaseModel.trigger(this.collection, "fetch", recordsList, attributes);

    return recordsList;
  }

  /**
   * Delete one or more record
   */
  public static async delete(id: number | undefined): Promise<any> {
    const filters: any = {};
    if (id) {
      filters["id"] = id;
    }

    return await this.query.delete(filters);
  }

  /**
   * Get query builder
   */
  public static get query() {
    return database.query(this.collection);
  }

  /**
   * Get aggregate for current model collection
   */
  public static get _(): Aggregate {
    return this.query.aggregate.withModel(this.collection);
  }

  /**
   * Get query builder
   */
  public get query() {
    return database.query(this.collection);
  }

  /**
   * Get aggregate for current model collection
   */
  public get _() {
    return this.query.aggregate.withModel(this.collection);
  }

  /**
   * Get collection name
   */
  public get collection(): string {
    return this.const("collection");
  }

  /**
   * Add event listener to current model
   */
  public static on(event: ModelEventName, callback: any): EventSubscription {
    return events.subscribe(this.eventName(this.collection, event), callback);
  }

  /**
   * Add event listener before Creating a new model
   */
  public static onCreating(
    callback: (model: BaseModel<any>) => void
  ): EventSubscription {
    return this.on("creating", callback);
  }

  /**
   * Add event listener after Creating a new model
   */
  public static onCreate(
    callback: (model: BaseModel<any>) => void
  ): EventSubscription {
    return this.on("create", callback);
  }

  /**
   * Add event listener before updating the model
   */
  public static onUpdating(
    callback: (model: BaseModel<any>, oldData: any) => void
  ): EventSubscription {
    return this.on("updating", callback);
  }

  /**
   * Add event listener after updating the model
   */
  public static onUpdate(
    callback: (model: BaseModel<any>) => void
  ): EventSubscription {
    return this.on("update", callback);
  }

  /**
   * Add event listener before Creating or updating a model
   */
  public static onSaving(
    callback: (model: BaseModel<any>, mode: "create" | "update") => void
  ): EventSubscription {
    return this.on("saving", callback);
  }

  /**
   * Add event listener after Creating or updating a model
   */
  public static onSave(
    callback: (
      model: BaseModel<any>,
      mode: "create" | "update",
      oldData?: any
    ) => void
  ): EventSubscription {
    return this.on("save", callback);
  }

  /**
   * Add event listener before deleting a model
   */
  public static onDeleting(
    callback: (model: BaseModel<any>) => void
  ): EventSubscription {
    return this.on("deleting", callback);
  }

  /**
   * Add event listener after deleting a model
   */
  public static onDelete(
    callback: (model: BaseModel<any>) => void
  ): EventSubscription {
    return this.on("delete", callback);
  }

  /**
   * Add event listener before listing records
   */
  public static onFetching(
    callback: (attributes: any) => void
  ): EventSubscription {
    return this.on("fetching", callback);
  }

  /**
   * Add event listener after listing records
   */
  public static onFetch(
    callback: (records: Collection<any>, attributes: any) => void
  ): EventSubscription {
    return this.on("fetch", callback);
  }

  /**
   * Trigger event
   */
  public static trigger(
    collection: string,
    event: ModelEventName,
    ...args: any[]
  ): void {
    // for global listening
    events.trigger(`database.models.${event}`, ...args, collection);
    return events.trigger(this.eventName(collection, event), ...args);
  }

  /**
   * Get full event name
   */
  public static eventName(collection: string, event: ModelEventName): string {
    return `database.models.${collection}.${event}`;
  }

  /**
   * On any model update
   */
  public static onModel(
    event: ModelEventName,
    callback: any
  ): EventSubscription {
    return events.subscribe(`database.models.${event}`, callback);
  }

  /**
   * Get a static property/method from non static method
   */
  public const(property: string): any {
    const base: any = <typeof BaseModel>this.constructor;
    return base[property];
  }

  /**
   * Shared data
   */
  public get sharedData(): Schema {
    return this.data;
  }

  /**
   * One model serializing to json
   */
  public toJSON(): any {
    return this.data;
  }

  /**
   * Remove all data from users data
   */
  public static async truncate(): Promise<any> {
    await databaseManager.truncate(this.collection);
  }
}

interface BaseModel<Schema> extends ModelAttributes<Schema> {}
applyMixins(BaseModel, [ModelAttributes]);

export interface ModelInterface<Schema> extends BaseModel<Schema> {}

const Model = BaseModel;

export default Model;
