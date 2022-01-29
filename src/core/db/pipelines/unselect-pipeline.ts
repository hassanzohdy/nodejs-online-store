import { Pipeline } from "../types";
import PipelineManager from "../pipeline";

export default class UnselectPipeline
  extends PipelineManager
  implements Pipeline
{
  /**
   * {@inheritdoc}
   */
  public name: string = "unselect";

  /**
   * {@inheritdoc}
   */
  public get officialName(): string {
    return "$unset";
  }

  /**
   * Set pipeline data
   */
  public setData(columns: string[]): Pipeline {
    this.data = columns;

    return this;
  }

  /**
   * {@inheritDoc}
   */
  public parseData(): any {
    return this.data;
  }
}
