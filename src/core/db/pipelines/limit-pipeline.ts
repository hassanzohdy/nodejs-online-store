import { Pipeline } from "../types";
import PipelineManager from "../pipeline";

export default class LimitPipeline extends PipelineManager implements Pipeline {
  /**
   * {@inheritdoc}
   */
  public name: string = "limit";

  /**
   * Set pipeline data
   */
  public setData(limit: number): LimitPipeline {
    this.data = limit;

    return this;
  }
}
