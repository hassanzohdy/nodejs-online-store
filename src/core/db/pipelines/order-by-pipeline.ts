import { Pipeline } from "../types";
import PipelineManager from "../pipeline";

export default class SkipPipeline extends PipelineManager implements Pipeline {
  /**
   * {@inheritdoc}
   */
  public name: string = "skip";

  /**
   * Set pipeline data
   */
  public setData(skip: number): Pipeline {
    this.data = skip;

    return this;
  }
}
