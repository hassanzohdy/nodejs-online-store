import chalk from "chalk";
import { log } from "../log";
import { Db, MongoClient } from "mongodb";
import { DatabaseConfigurations } from "./types";

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
   * Database configurations
   */
  protected databaseConfigurations!: DatabaseConfigurations;

  /**
   * Connect to database
   */
  public async connect(databaseConfigurations: DatabaseConfigurations) {
    if (this.client) return;

    const port: number = databaseConfigurations.port || 27017;

    const server: string = databaseConfigurations.server || "localhost";

    const url = `mongodb://${server}:${port}`;
    this.client = new MongoClient(url, {
      auth: {
        username: databaseConfigurations.username,
        password: databaseConfigurations.password,
      },
    });

    this.databaseConfigurations = databaseConfigurations;

    await this.client.connect();

    log(chalk.greenBright("Connected To Database Successfully!"));

    this.setDatabase(databaseConfigurations.databaseName);
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