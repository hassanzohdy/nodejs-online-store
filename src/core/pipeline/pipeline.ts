export default class Pipeline {
  /**
   * stages list list
   */
  protected stages: any[] = [];

  /**
   * Constructor
   */
  public constructor(stages: any[] = []) {
    this.stages = stages;
  }

  /**
   * Add new pipeline
   */
  public pipe(callback: any): Pipeline {
    this.stages.push(callback);
    return this;
  }

  /**
   * Process pipelines and pass the given value to all pipelines
   */
  public async process(passableValue: any): Promise<any> {
    for (let i = 0; i < this.stages.length; i++) {
      let pipeline = this.stages[i];

      passableValue = await pipeline(passableValue);
    }

    return passableValue;
  }
}
