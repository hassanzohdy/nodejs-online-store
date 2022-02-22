import chalk from "chalk";
import database from "core/db";
import { log } from "core/log";
import { now } from "utils/date";
import { sha1 } from "@mongez/encryption";
import databaseManager from "./DatabaseManager";
import Migration, { MigrationSchema } from "./models/Migration";
import { CreateIndexesOptions, IndexSpecification } from "mongodb";
import Is from "@mongez/supportive-is";

/**
 * Blueprint Class
 *
 * `sparse`: true, means the index can be created on nullable or empty values
 */

export default class Blueprint<Schema> {
  /**
   * Collection name must be provided
   */
  public constructor(protected collection: string) {}

  /**
   * Store all operations in an object to determine whether this migration has been created before.
   */
  public operations: any = {
    indexes: [],
  };

  /**
   * Create a new Blueprint instance
   */
  public static of<T>(collection: string): Blueprint<T> {
    return new Blueprint<T>(collection);
  }

  /**
   * Create unique indexes for the given columns
   */
  public unique(
    columns: IndexSpecification,
    options?: CreateIndexesOptions
  ): Blueprint<Schema> {
    const uniqueOptions: CreateIndexesOptions = {
      unique: true,
      sparse: true,
      ...options,
    };
    return this.index(columns, uniqueOptions);
  }

  /**
   * Create text search indexes for the given columns
   */
  public textSearch(
    columns: IndexSpecification,
    options?: CreateIndexesOptions
  ): Blueprint<Schema> {
    const uniqueOptions: CreateIndexesOptions = {
      sparse: true,
      textIndexVersion: 3,
      ...options,
    };

    if (Is.array(columns)) {
      columns = columns.map((column) => {
        if (Is.string(column)) {
          return {
            [column as string]: "text",
          };
        }

        return column;
      }) as any;
    }

    return this.index(columns, uniqueOptions);
  }

  /**
   * Create normal indexes for the given columns
   */
  public index(
    columns: IndexSpecification,
    options: CreateIndexesOptions = {}
  ): Blueprint<Schema> {
    const defaults: CreateIndexesOptions = {
      background: true,
    };

    options = { ...defaults, ...options };

    this.operations.indexes.push({
      columns,
      options,
    });

    return this;
  }

  /**
   * Create indexes
   */
  protected async createIndexes(): Promise<any> {
    for (let indexOperation of this.operations.indexes) {
      const { columns, options } = indexOperation;
      await this.query.createIndex(columns as string, options);
    }

    return this;
  }

  /**
   * Create a new migrate
   */
  public async migrate(name: string): Promise<any> {
    const collectionName: string = chalk.blueBright.bold(this.collection);
    log(
      chalk.yellow(
        `Creating ${chalk.cyan(
          name
        )} Migration for ${collectionName} collection...`
      )
    );

    const migrationHash = sha1(JSON.stringify(this.operations));

    const hasBeenMigratedBefore = await Migration.first({
      hash: migrationHash,
      collection: this.collection,
    });

    if (hasBeenMigratedBefore) {
      return log(
        chalk.redBright(
          `The ${chalk.cyan(
            name
          )} migration in ${collectionName} collection, has been created before, skipping...`
        )
      );
    }

    if (this.operations.indexes) {
      await this.createIndexes();
    }

    if (this.operations.drop) {
      await databaseManager.drop(this.collection);
    }

    if (this.operations.truncate) {
      await databaseManager.truncate(this.collection);
    }

    await Migration.create<MigrationSchema>({
      hash: migrationHash,
      collection: this.collection,
      name: name,
      operations: this.operations,
      createdAt: now(),
    });

    log(
      chalk.green(
        `Migration ${chalk.cyan(
          name
        )} in ${collectionName} collection has been created successfully.`
      )
    );
  }

  /**
   * Drop the entire collection
   */
  public drop(): Blueprint<any> {
    this.operations.drop = true;
    return this;
  }

  /**
   * Clear all documents from the collection and unset the collection from database manager
   */
  public truncate(): Blueprint<any> {
    this.operations.truncate = true;
    return this;
  }

  /**
   * Get collection query
   */
  public get query() {
    return database.collection(this.collection);
  }
}
