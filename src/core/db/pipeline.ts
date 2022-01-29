import Aggregate from "./aggregate";
import { Pipeline } from "./types";

export default abstract class PipelineManager implements Pipeline {
  /**
   * {@inheritdoc}
   */
  public name: string = "";

  /**
   * {@inheritdoc}
   */
  public data: any = {};

  /**
   * Constructor
   */
  public constructor(protected aggregate: Aggregate) {}

  /**
   * Parse data
   */
  public parse(): any {
    return {
      [this.officialName]: this.parseData(),
    };
  }

  /**
   * {@inheritDoc}
   */
  public abstract setData(...args: any[]): Pipeline;

  /**
   * Parse data for the current aggregate
   */
  public parseData(): any {
    return this.data;
  }

  /**
   * {@inheritdoc}
   */
  public get officialName(): string {
    return `$${this.name}`;
  }
}
