import database from "./database";
import Aggregate from "./aggregate";
import Is from "@mongez/supportive-is";
import { Collection, Filter } from "mongodb";

export default abstract class Model {
  /**
   * Database collection name
   */
  protected collection!: string;

  /**
   * Constructor
   */
  public constructor() {}

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
   * Insert data into the current model
   */
  public async insert(data: any) {
    if (Is.array(data)) {
      return await this.query.insertMany(data);
    } else {
      return await this.query.insertOne(data);
    }
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
