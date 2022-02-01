import { Obj } from "@mongez/reinforcements";

export default class Attributes<Schema> {
  /**
   * Model attributes
   */
  public attributes: any = {};

  /**
   * An alias to set an attribute
   */
  public setAttribute(column: string, value: any): Attributes<Schema> {
    Obj.set(this.attributes, column, value);
    return this;
  }

  /**
   * Merge the given attributes to current attributes
   */
  public setAttributes<T>(attributes: T): Attributes<Schema> {
    this.attributes = { ...this.attributes, ...attributes };
    return this;
  }

  /**
   * Get attribute value
   */
  public getAttribute(attribute: string, defaultValue: any = null): any {
    return Obj.get(this.attributes, attribute, defaultValue);
  }
}
