import { Collection } from "mongodb";
import database from ".";

export class DatabaseManager {
  /**
   *  {@inheritdoc}
   */
  public static collection: string = "informationSchema";

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
          id: nextId,
        },
        $setOnInsert: {
          collection: collectionName,
          migrations: [],
          indexes: [],
          totalDocuments: 0,
          size: 0,
          largestDocumentId: 0,
          largestDocumentSize: 0,
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
    return database.collection(DatabaseManager.collection);
  }

  /**
   * Remove collection from the list
   */
  public async unset(collection: string): Promise<DatabaseManager> {
    await this.query.deleteOne({
      collection,
    });
    return this;
  }

  /**
   * Clear the given collection documents and keep the collection
   */
  public async truncate(collection: string): Promise<DatabaseManager> {
    await database.collection(collection).deleteMany({});

    // reset the data
    await this.query.updateOne(
      {
        collection,
      },
      {
        $set: {
          collection,
          migrations: [],
          indexes: [],
          id: 0,
          totalDocuments: 0,
          size: 0,
          largestDocumentId: 0,
          largestDocumentSize: 0,
        },
      },
      {
        upsert: true,
      }
    );

    return this;
  }

  /**
   * Drop collection
   */
  public async drop(collection: string): Promise<any> {
    await database.collection(collection).drop();
    await this.unset(collection);
  }

  /**
   * Add new index to the given collection information
   */
  public async addIndex(collection: string, data: any): Promise<any> {
    return await this.query.updateOne(
      {
        collection,
      },
      {
        $push: {
          indexes: data,
        },
      }
    );
  }

  /**
   * Remove index from the indexes list
   */
  public async dropIndex(collection: string, indexName: string): Promise<any> {
    return await this.query.updateOne(
      {
        collection,
      },
      {
        $pull: {
          indexes: {
            index: indexName,
          },
        },
      }
    );
  }

  /**
   * Get information of the given collection name
   */
  public async informationOf(collection: string): Promise<any> {
    return await this.query.findOne({
      collection,
    });
  }

  /**
   * Get all collections in the current database
   */
  public async listCollections(): Promise<any[]> {
    return await database.db.listCollections().toArray();
  }
}

const databaseManager: DatabaseManager = new DatabaseManager();

export default databaseManager;
