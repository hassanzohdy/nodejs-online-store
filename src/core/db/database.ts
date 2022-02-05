import chalk from "chalk";
import { log } from "../log";
import { Collection, Db, MongoClient } from "mongodb";
import events, { EventSubscription } from "@mongez/events";
import { DatabaseConfigurations, DatabaseEvent } from "./types";
import { modelsList } from "./models";
import QueryBuilder from "./QueryBuilder";

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
    try {
      await this.client.connect();

      this.setDatabase(databaseConfigurations.databaseName);

      setTimeout(() => {
        log(chalk.greenBright("Connected To Database Successfully!"));
        this.trigger("connection", this);
      }, 100);
    } catch (error) {
      log(error);
    }
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

  /**
   * Store model in models list
   */
  public defineModel(collection: string, model: any) {
    modelsList[collection] = model;
  }

  /**
   * Create new query builder for the given collection name
   */
  public query(collection: string): QueryBuilder {
    return new QueryBuilder(collection);
  }
}

const database: Database = new Database();

export default database;
