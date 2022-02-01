import applyMixins from "utils/mixins";
import Attributes from "./Attributes";
import databaseManager from "./DatabaseManager";
import ModelQuickAccessors from "./ModelQuickAccessors";

abstract class BaseModel<Schema> {
  /**
   * Dynamic call for attributes
   */
  [key: string]: any;
  /**
   * Constructor
   */
  public constructor(attributes: Schema = {} as Schema) {
    /**
     * Constructor
     */
    this.attributes = { ...attributes };
    return new Proxy<BaseModel<Schema>>(this, {
      set: (model: any, name: string, value: any): boolean => {
        if (model[name]) {
          model[name] = value;
        } else {
          model.attributes[name] = value;
        }
        return true;
      },
      get: (model: any, key: string): any => {
        return (model as any)[key] || this.attributes[key];
      },
      deleteProperty: (model: any, key: any): boolean => {
        if (key in model) {
          delete (model as any)[key];
        } else {
          delete model.attributes[key];
        }

        return true;
      },
    });
  }

  /**
   * Save data into database
   */
  public async save(newAttributes: any = {}): Promise<any> {
    if (this.id) {
      return this.update(newAttributes);
    }

    return this.insert(newAttributes);
  }

  /**
   * Insert new record
   */
  public async insert(newAttributes: any = {}): Promise<any> {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.setAttributes(newAttributes);

    if (!this.id) {
      this.id = await databaseManager.newId(ModelQuickAccessors.collection);
    }

    return await ModelQuickAccessors.query.insert(this.attributes);
  }

  /**
   * Update data
   */
  public async update(newAttributes: any = {}): Promise<any> {
    this.updatedAt = new Date();
    this.setAttributes(newAttributes);
    return await ModelQuickAccessors.query.update(
      { id: this.id },
      this.attributes
    );
  }
}

// @see https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
interface BaseModel<Schema>
  extends Attributes<Schema>,
    ModelQuickAccessors<Schema> {}
applyMixins(BaseModel, [Attributes]);

const Model = BaseModel;

export default Model;
