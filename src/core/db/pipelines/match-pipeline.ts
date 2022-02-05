import Is from "@mongez/supportive-is";
import PipelineManager from "../pipeline";
import { LogicalOperator, Pipeline } from "../types";
import { parseOperator } from "../utils";

export default class MatchPipeline extends PipelineManager implements Pipeline {
  /**
   * {@inheritdoc}
   */
  public name: string = "match";
  /**
   * {@inheritdoc}
   */
  public data: any = {
    /**
     * Types here can be `and`| `or` | `not`
     */
    types: {},
  };

  /**
   * Set pipeline data
   */
  public setData(
    column: any,
    operator?: any,
    value?: any,
    type: LogicalOperator = "or"
  ): MatchPipeline {
    if (Is.array(column)) {
      if (operator) {
        type = operator;
      }
      column.forEach((data: any) => {
        if (Is.array(data)) {
          const [column, operator, value] = data;
          this.setData(column, operator, value, type);
        } else if (Is.plainObject(data)) {
          const { column, operator = "=", value } = data;
          this.setData(column, operator, value, type);
        }
      });

      return this;
    } else if (Is.plainObject(column)) {
      if (operator) {
        type = operator;
      }
      for (let columnName in column) {
        const value = column[columnName];
        const operator = "=";
        this.setData(columnName, operator, value, type);
      }

      return this;
    }

    if (value === undefined) {
      value = operator;
      operator = "=";
    }

    if (value instanceof RegExp && operator === "=") {
      operator = "like";
    }

    if (operator === "like") {
      value = new RegExp(value);
    }

    const data = {
      column,
      value,
      operator: parseOperator(operator),
    };

    if (this.data.types[type]) {
      this.data.types[type].push(data);
    } else {
      this.data.types[type] = [data];
    }

    return this;
  }

  /**
   * Parse data for the current aggregate
   */
  public parseData(): any {
    const data: any = {};

    for (let type in this.data.types) {
      const typeData = this.data.types[type].map((expression: any) => {
        return {
          [expression.column]: {
            [expression.operator]: expression.value,
          },
        };
      });

      data[`$${type}`] = typeData;
    }

    return data;
  }
}
