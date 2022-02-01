import database from "./database";
import Aggregate from "./aggregate";
import Is from "@mongez/supportive-is";
import { Collection, Filter } from "mongodb";
import databaseManager from "./DatabaseManager";
import { log } from "console";

export default class QueryBuilder {
  /**
   * Model data
   */
  protected data: any = {};

  /**
   * Constructor
   */
  public constructor(public collection: string) {}

  /**
   * Get list of records for the given options
   */
  public async list<T>(options: Filter<T> = {}): Promise<any[]> {
    return await this.query.find(options).toArray();
  }

  /**
   * Get the first matched record for the given options
   */
  public async first<T>(options: Filter<T> = {}): Promise<any> {
    return await this.query.findOne(options);
  }

  /**
   * Get data by the given value
   */
  public async find(value: any, column: string = "id"): Promise<any> {
    return this.first({
      [column]: value,
    });
  }

  /**
   * Insert data into the current model
   */
  public async insert(data: any) {
    if (Is.array(data)) {
      data.forEach(this.setId);
      return await this.query.insertMany(data);
    } else {
      this.setId(data);
      return await this.query.insertOne(data);
    }
  }

  /**
   * Update data based on the given search
   */
  public async update(search: any, data: any) {
    return await this.query.updateOne(search, data);
  }

  /**
   * Generate new id for the given data
   */
  protected setId(data: any): void {
    if (data.id) return;

    data.id = databaseManager.newId(this.collection);
  }

  /**
   * Get next id for current collection
   */
  public get nextId(): number {
    return databaseManager.getNextId(this.collection);
  }

  /**
   * Alias to aggregate getter
   */
  public get _() {
    return this.aggregate;
  }

  /**
   * Get aggregate instance for current model
   */
  public get aggregate() {
    return new Aggregate(this.query);
  }

  /**
   * Get the collection handler
   */
  public get query(): Collection {
    return database.collection(this.collection);
  }
}
