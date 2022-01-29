import chalk from "chalk";
import { log } from "../log";
import { Collection, Db, MongoClient } from "mongodb";
import events, { EventSubscription } from "@mongez/events";
import { DatabaseConfigurations, DatabaseEvent } from "./types";

class Database {
  /**
   * Database Driver Client
   */
  public client!: MongoClient;

  /**
   * Database handler
   */
  public db!: Db;

  /**
   * Database configurations
   */
  public databaseConfigurations!: DatabaseConfigurations;

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

    this.setDatabase(databaseConfigurations.databaseName);

    this.trigger("connection", this);

    log(chalk.greenBright("Connected To Database Successfully!"));
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

  /**
   * Get database collection
   */
  public collection(collectionName: string): Collection {
    return this.db.collection(collectionName);
  }

  /**
   * Trigger events for database
   */
  public on(
    event: DatabaseEvent,
    callback: (database: Database) => void
  ): EventSubscription {
    return events.subscribe(`database.${event}`, callback);
  }

  /**
   * Trigger database event
   */
  public trigger(event: DatabaseEvent, ...data: any[]): void {
    events.trigger(`database.${event}`, ...data);
  }
}

const database: Database = new Database();

export default database;
