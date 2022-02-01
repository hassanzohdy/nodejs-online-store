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
  public async newId(collectionName: string): Promise<number> {
    const nextId: number = await this.getNextId(collectionName);

    await this.query.updateOne(
      {
        collection: collectionName,
      },
      {
        $set: {
          collection: collectionName,
          id: nextId,
        },
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
  public async getNextId(collectionName: string): Promise<number> {
    const collection: any = await this.query.findOne({
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
