import { DatabaseSelect, OrderBySchema, Pipeline } from "../types";
import PipelineManager from "../pipeline";
import Is from "@mongez/supportive-is";

export default class SelectPipeline
  extends PipelineManager
  implements Pipeline
{
  /**
   * {@inheritdoc}
   */
  public name: string = "select";

  /**
   * {@inheritdoc}
   */
  public get officialName(): string {
    return "$project";
  }

  /**
   * Set pipeline data
   */
  public setData(columns: DatabaseSelect): Pipeline {
    this.data = columns;

    return this;
  }

  /**
   * {@inheritDoc}
   */
  public parseData(): any {
    let selections: any = {};
    if (Is.array(this.data)) {
      for (let column of this.data) {
        selections[column] = 1;
      }
    } else {
      selections = this.data;
    }

    console.log(selections);

    return selections;
  }
}
