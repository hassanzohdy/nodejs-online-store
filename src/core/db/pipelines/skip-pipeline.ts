import { OrderBySchema, Pipeline } from "../types";
import PipelineManager from "../pipeline";
import { DynamicObject } from "utils/types";

export default class OrderByPipeline
  extends PipelineManager
  implements Pipeline
{
  /**
   * {@inheritdoc}
   */
  public name: string = "sort";

  /**
   * Set pipeline data
   */
  public setData(columns: OrderBySchema): Pipeline {
    this.data = columns;

    return this;
  }

  /**
   * {@inheritDoc}
   */
  public parseData(): any {
    const columns: any = {};

    for (let column in this.data) {
      let orderValue: string | number = this.data[column];

      if (String(orderValue).toLocaleLowerCase() === "desc") {
        orderValue = -1;
      } else if (String(orderValue).toLocaleLowerCase() === "asc") {
        orderValue = 1;
      }

      columns[column] = orderValue;
    }

    return columns;
  }
}
