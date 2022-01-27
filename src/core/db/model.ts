import Is from "@mongez/supportive-is";
import { Collection } from "mongodb";
import database from "./database";

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
   * Get the collection handler
   */
  public get handler(): Collection {
    return database.collection(this.collection);
  }

  /**
   * Insert data into the given model
   */
  public async insert(data: any) {
    if (Is.array(data)) {
      return await this.handler.insertMany(data);
    } else {
      return await this.handler.insertOne(data);
    }
  }
}
