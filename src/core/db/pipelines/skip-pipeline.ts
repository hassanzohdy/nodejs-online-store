import { OrderBySchema, Pipeline } from "../types";
import PipelineManager from "../pipeline";
import { DynamicObject } from "utils/types";

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
