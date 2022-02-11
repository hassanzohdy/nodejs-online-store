import { DynamicObject } from "utils/types";
import {
  DeleteOptions,
  DeleteResult,
  Document,
  UpdateOptions,
  UpdateResult,
} from "mongodb";
import { DateTime } from "luxon";
import { Collection } from "collect.js";

export type DatabaseConfigurations = {
  /**
   * Database Server
   *
   * @default localhost
   */
  server?: string;
  /**
   * Database port
   *
   * @default 27017
   */
  port?: number;
  /**
   * Default Database Name
   */
  databaseName: string;
  /**
   * Default Auth username
   */
  username: string;
  /**
   * Default Auth password
   */
  password: string;
};

/**
 * Database events
 */
export type DatabaseEvent = "connection";

/**
 * Pipeline interface
 */
export interface Pipeline {
  /**
   * Pipeline name
   */
  name: string;
  /**
   * Pipeline MongoDB name
   */
  officialName: string;
  /**
   * Pipeline Internal data
   */
  data: any;
  /**
   * Set pipeline data
   */
  setData(...args: any[]): Pipeline;
  /**
   * Parse pipeline data to be returned as MongoDB Aggregate pipeline with its official name as an object
   */
  parse(): any;
  /**
   * Parse pipeline data only without the MongoDB official name
   */
  parseData(): any;
}

/**
 * Allowed logical operators in MongoDB
 */
export type LogicalOperator = "and" | "or" | "not";

/**
 * MongoDB Collection Update
 */
export type DataUpdate = Promise<UpdateResult | Document>;

export type DatabaseOperator =
  | "="
  | ">"
  | ">="
  | "<"
  | "<="
  | `in`
  | `notIn`
  | "!="
  | "like"
  | `not`;

export type OperatorsList = {
  [key in DatabaseOperator]: string;
};

/**
 * Database column name
 */
export type Column = string;
/**
 * Database searching value
 */
export type Value = any;

export type WhereArrayHasNoOperator = [Column, Value];

/**
 * Where clause with an array of arrays, each array has three elements
 */
export type WhereArrayHasOperator = [Column, DatabaseOperator, Value];

/**
 * Where clause with an array of object, each object has two/three elements
 */
export type WhereSearchingAsObject = {
  column: Column;
  value: Value;
  operator?: DatabaseOperator;
};

export type OrderBySchema = {
  [column: string]: 1 | -1 | "desc" | "DESC" | "asc" | "ASC";
};

export type DatabaseSelect = string[] | DynamicObject;

/**
 * Aggregate interface
 */
export interface AggregateInterface {
  /**
   * Select columns clause
   */
  select(columns: DatabaseSelect): AggregateInterface;

  /**
   * UnSelect columns clause
   */
  unselect(columns: string[]): AggregateInterface;

  /**
   * Entire Where clause
   *
   * @param column Database column
   * @param operator Database Operator
   * @param value Column searching value
   * @param type Logical Operator
   */
  where(
    column: Column | any,
    operator: DatabaseOperator,
    value: Value,
    type?: LogicalOperator
  ): AggregateInterface;

  /**
   * Where like clause
   */
  whereLike(column: Column, value: Value): AggregateInterface;
  /**
   * Define the associated model for this aggregate instance
   */
  withModel(modelName: string): AggregateInterface;
  /**
   * Limit clause
   */
  limit(limit: number): AggregateInterface;

  /**
   * Skip clause
   */
  skip(skip: number): AggregateInterface;

  /**
   * Order by clause
   */
  orderBy(columns: OrderBySchema): AggregateInterface;

  /**
   * Order by latest documents
   */
  latest(): AggregateInterface;

  /**
   * List all records
   */
  list<T>(selectColumns?: DatabaseSelect): Promise<Collection<T | any>>;

  /**
   * Order by latest documents and retrieve it
   */
  latestList<T>(columns?: DatabaseSelect): Promise<Collection<T>>;

  /**
   * Paginate data
   */
  paginate<T>(paginationSetup?: PaginationSetup): Promise<PaginationData>;

  /**
   * Get only first matched record
   */
  first<T>(selectColumns?: string[] | DynamicObject): Promise<T>;

  /**
   * Perform updates based on the pipelines
   */
  update(
    newData: any,
    options?: UpdateOptions,
    updateMode?: "updateOne" | "updateMany"
  ): DataUpdate;

  /**
   * Update or insert the given data
   */
  upsert(data: any, options?: UpdateOptions): DataUpdate;

  /**
   * Update only one document
   */
  updateOnce(data: any, options?: UpdateOptions): DataUpdate;
  /**
   * Insert/Update only one document
   */
  upsertOnce(data: any, options?: UpdateOptions): DataUpdate;
  /**
   * Remove records based on pipelines
   */
  remove(options?: DeleteOptions): Promise<DeleteResult>;
}

export type PaginationSetup = {
  page?: number;
  size?: number;
};

export type PaginationData = {
  records: Collection<any>;
  info: {
    totalRecords: number;
    page: number;
    size: number;
    lastPage: number;
    resultsSize: number;
  };
};

export type ModelsList = {
  [collectionName: string]: any;
};

export type BaseSchema = {
  id?: number;
  _id?: string;
  createdAt?: Date | DateTime;
  updatedAt?: Date | DateTime;
};

export type CastType =
  | "string"
  | "int"
  | "integer"
  | "float"
  | "double"
  | "boolean"
  | "bool"
  | "file"
  | "date"
  | CastType[]
  | BaseSchema[];

export type AttributesCasts = {
  [column: string]: CastType;
};

export type ModelEventName =
  | "creating"
  | "create"
  | "updating"
  | "update"
  | "saving"
  | "save"
  | "deleting"
  | "delete"
  | "fetching"
  | "fetch";
