import { DynamicObject } from "utils/types";
import {
  Collection,
  DeleteOptions,
  DeleteResult,
  UpdateOptions,
} from "mongodb";
import LimitPipeline from "./pipelines/limit-pipeline";
import MatchPipeline from "./pipelines/match-pipeline";
import SkipPipeline from "./pipelines/skip-pipeline";
import {
  AggregateInterface,
  Column,
  DatabaseOperator,
  DatabaseSelect,
  DataUpdate,
  LogicalOperator,
  OrderBySchema,
  Pipeline,
  Value,
  WhereArrayHasNoOperator,
  WhereArrayHasOperator,
  WhereSearchingAsObject,
} from "./types";
import { log } from "../log";
import OrderByPipeline from "./pipelines/skip-pipeline";
import SelectPipeline from "./pipelines/select-pipeline";
import UnselectPipeline from "./pipelines/unselect-pipeline";

// typescript function overload
export default class Aggregate implements AggregateInterface {
  /**
   * Pipelines list
   */
  public pipelines: any[] = [];

  /**
   * Constructor
   */
  public constructor(public query: Collection) {}

  /**
   * Where clause, the default operator will be `=`
   *
   * @param column Database column
   * @param value Column searching value
   */
  public where(column: Column, value: Value): AggregateInterface;
  /**
   * Where clause, the default operator will be `=`
   *
   * @param column Database column
   * @param operator Database Operator
   * @param value Column searching value
   */
  public where(
    column: Column,
    operator: DatabaseOperator,
    value: Value
  ): AggregateInterface;
  /**
   * Entire Where clause
   *
   * @param column Database column
   * @param operator Database Operator
   * @param value Column searching value
   * @param type Logical Operator
   */
  public where(
    column: Column | any,
    operator: DatabaseOperator,
    value: Value,
    type: LogicalOperator
  ): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an array, the array can be a list of arrays,
   * each internal array has two elements: [column, value], operator will be `=`
   *
   * @param columnsList Database column
   */
  public where(columnsList: WhereArrayHasNoOperator[]): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an array, the array can be a list of arrays,
   * each internal array has three elements [column, operator, value]
   *
   * @param columnsList Database column
   */
  public where(columnsList: WhereArrayHasOperator[]): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an array of objects
   * The object contains three properties, `column`, `operator`(default `=`) and `column`
   *
   * @param columnsList Database column
   */
  public where(columnsList: WhereSearchingAsObject[]): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an object, the object key is the column and its value is the searching value for that column
   * The default operator is `=
   *
   * @param columnsList Columns list to be searched by
   */
  public where(columnsList: DynamicObject): AggregateInterface;

  /**
   * @param column Database column
   * @param operator Database Operator
   * @param value Column searching value
   * @param type Logical Operator
   */
  public where(...args: any[]): AggregateInterface {
    return this.newPipeline(new MatchPipeline(this), ...args);
  }

  /**
   * Where clause, the default operator will be `=`
   *
   * @param column Database column
   * @param value Column searching value
   */
  public orWhere(column: Column, value: Value): AggregateInterface;
  /**
   * Where clause, the default operator will be `=`
   *
   * @param column Database column
   * @param operator Database Operator
   * @param value Column searching value
   */
  public orWhere(
    column: Column,
    operator: DatabaseOperator,
    value: Value
  ): AggregateInterface;

  /**
   * Where clause, Accepts only one argument, an array, the array can be a list of arrays,
   * each internal array has two elements: [column, value], operator will be `=`
   *
   * @param columnsList Database column
   */
  public orWhere(columnsList: WhereArrayHasNoOperator[]): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an array, the array can be a list of arrays,
   * each internal array has three elements [column, operator, value]
   *
   * @param columnsList Database column
   */
  public orWhere(columnsList: WhereArrayHasOperator[]): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an array of objects
   * The object contains three properties, `column`, `operator`(default `=`) and `column`
   *
   * @param columnsList Database column
   */
  public orWhere(columnsList: WhereSearchingAsObject[]): AggregateInterface;
  /**
   * Where clause, Accepts only one argument, an object, the object key is the column and its value is the searching value for that column
   * The default operator is `=
   *
   * @param columnsList Columns list to be searched by
   */
  public orWhere(columnsList: DynamicObject): AggregateInterface;

  /**
   * Or Where clause
   */
  public orWhere(column: any, operator?: any, value?: any): AggregateInterface {
    return this.where(column, operator, value, "or");
  }

  /**
   * Where in clause
   */
  public whereIn(column: Column, value: Value[]): AggregateInterface {
    return this.where(column, "in", value);
  }

  /**
   * Where not clause
   */
  public whereNot(
    column: Column,
    value: Value,
    type: LogicalOperator = "and"
  ): AggregateInterface {
    return this.where(column, "!=", value, type);
  }

  /**
   * Or Where in clause
   */
  public orWhereIn(column: Column, value: Value): AggregateInterface {
    return this.where(column, "in", value, "or");
  }

  /**
   * Or Where not in clause
   */
  public whereNotIn(
    column: Column,
    value: Value[],
    type: LogicalOperator = "and"
  ): AggregateInterface {
    return this.where(column, "notIn", value, type);
  }

  /**
   * Or Where not in clause
   */
  public orWhereNotIn(column: Column, value: Value[]): AggregateInterface {
    return this.whereNotIn(column, value, "or");
  }

  /**
   * Where null clause
   */
  public whereNull(
    column: Column,
    type: LogicalOperator = "and"
  ): AggregateInterface {
    return this.where(column, "=", null, type);
  }

  /**
   * Where not null clause
   */
  public whereNotNull(
    column: Column,
    type: LogicalOperator = "and"
  ): AggregateInterface {
    return this.where(column, "!=", null, type);
  }

  /**
   * Limit clause
   */
  public limit(limit: number): AggregateInterface {
    return this.newPipeline(new LimitPipeline(this), limit);
  }

  /**
   * Skip clause
   */
  public skip(skip: number): AggregateInterface {
    return this.newPipeline(new SkipPipeline(this), skip);
  }

  /**
   * Order by clause
   */
  public orderBy(columns: OrderBySchema): AggregateInterface {
    return this.newPipeline(new OrderByPipeline(this), columns);
  }

  /**
   * Select columns clause
   */
  public select(columns: DatabaseSelect): AggregateInterface {
    return this.newPipeline(new SelectPipeline(this), columns);
  }

  /**
   * UnSelect columns clause
   */
  public unselect(columns: string[]): AggregateInterface {
    return this.newPipeline(new UnselectPipeline(this), columns);
  }

  /**
   * Create new Pipeline
   */
  public newPipeline(pipeline: Pipeline, ...data: any[]): AggregateInterface {
    this.pipelines.push(pipeline);

    pipeline.setData(...data);

    return this;
  }

  /**
   * Get the list of the documents for the processed pipelines
   */
  public async list(columns?: DatabaseSelect): Promise<any[]> {
    columns && this.select(columns);
    const records = await this.query.aggregate(this.parse()).toArray();

    this.reset();

    return records;
  }

  /**
   * Get only first matched record
   */
  public async first(columns?: DatabaseSelect): Promise<any> {
    columns && this.select(columns);

    const records = await this.limit(1).list();

    return records[0] || null;
  }

  /**
   * Perform updates based on the pipelines
   */
  public async update(
    newData: any,
    options: UpdateOptions = {},
    updateMode: "updateOne" | "updateMany" = "updateMany"
  ): DataUpdate {
    let filters = {};
    this.pipelines
      .filter((pipeline) => ["match", "unwind"].includes(pipeline.name))
      .forEach((pipeline) => {
        filters = { ...filters, ...pipeline.parseData() };
      });

    const update = this.query[updateMode];

    const records = await update(filters, [
      ...this.parseWithout(["match", "unwind"]),
      {
        $set: newData,
      },
      options,
    ]);

    this.reset();

    return records;
  }

  /**
   * Update or insert the given data
   */
  public upsert(data: any, options: UpdateOptions = {}): DataUpdate {
    return this.update(data, { ...options, upsert: true });
  }

  /**
   * Update only one document
   */
  public updateOnce(data: any, options: UpdateOptions = {}): DataUpdate {
    return this.update(data, options, "updateOne");
  }

  /**
   * Insert/Update only one document
   */
  public upsertOnce(data: any, options: UpdateOptions = {}): DataUpdate {
    return this.update(data, { ...options, upsert: true }, "updateOne");
  }

  /**
   * Parse all pipelines without the given types
   */
  public parseWithout(types: string[]): any[] {
    return this.pipelines
      .filter((pipeline) => !types.includes(pipeline.name))
      .map((pipeline) => pipeline.parse());
  }

  /**
   * Remove records based on pipelines
   */
  public remove(options: DeleteOptions = {}): Promise<DeleteResult> {
    let filters: any = {};
    this.pipelines
      .filter((pipeline) => ["match", "unwind"].includes(pipeline.name))
      .forEach((pipeline) => {
        filters = { ...filters, ...pipeline.parseData() };
      });

    this.reset();

    return this.query.deleteMany(filters, options);
  }

  /**
   * Parse pipelines
   */
  public parse(): any[] {
    const pipelines: any = this.pipelines.map((pipeline) => pipeline.parse());

    return pipelines;
  }

  /**
   * Reset aggregate pipelines
   */
  public reset() {
    this.pipelines = [];
  }
}
