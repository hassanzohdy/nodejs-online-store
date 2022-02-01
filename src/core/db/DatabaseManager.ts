import { Collection } from "mongodb";
import database from ".";

export class DatabaseManager {
  /**
   *  {@inheritdoc}
   */
  protected collection: string = "collections";

  /**
   * Generate new id and store it in the collections's collection
   *
   */
  public newId(collectionName: string): number {
    const nextId: number = this.getNextId(collectionName);

    this.query.updateOne(
      {
        collection: collectionName,
      },
      {
        collection: collectionName,
        id: nextId,
      },
      {
        upsert: true,
      }
    );

    return nextId;
  }

  /**
   * Get next for the given collection name
   */
  public getNextId(collectionName: string): number {
    const collection: any = this.query.findOne({
      collection: collectionName,
    });

    return collection ? collection.id + 1 : 1;
  }

  /**
   * Get query
   */
  public get query(): Collection {
    return database.collection(this.collection);
  }
}

const databaseManager: DatabaseManager = new DatabaseManager();

export default databaseManager;
