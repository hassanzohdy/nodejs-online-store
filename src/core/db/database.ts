import { Db, MongoClient } from "mongodb";

class Database {
  /**
   * Database Driver Client
   */
  protected client!: MongoClient;

  /**
   * Database handler
   */
  protected db!: Db;

  /**
   * Connect to database
   */
  public async connect() {
    if (this.client) return;

    const url = "mongodb://localhost:27017";
    this.client = new MongoClient(url, {
      auth: {
        username: "root",
        password: "BaseRoot",
      },
    });

    await this.client.connect();

    this.setDatabase("myDb");
  }

  /**
   * Set database name
   */
  public setDatabase(databaseName: string): void {
    this.db = this.client.db(databaseName);
  }

  /**
   * Determine whether a connection has been established to the database
   */
  public isConnected(): boolean {
    return this.client !== undefined;
  }
}

const database: Database = new Database();

export default database;
