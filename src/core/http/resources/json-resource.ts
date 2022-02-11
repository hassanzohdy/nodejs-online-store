import { Obj } from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import { ModelInterface } from "core/db/model";
import { uploadsUrl } from "core/router";
import date from "utils/date";
import { ResourceResourceType, ResourceType, ResourceDateType } from "./types";

export class JsonResource {
  /**
   * List of integer data for output
   */
  public int: Array<ResourceType | string> = [];

  /**
   * List of float data for output
   */
  public float: Array<ResourceType | string> = [];

  /**
   * List of float data for output
   */
  public boolean: Array<ResourceType | string> = [];

  /**
   * List of string data for output
   */
  public string: Array<ResourceType | string> = [];

  /**
   * List of assets data for output
   */
  public assets: Array<ResourceType | string> = [];

  /**
   * List of dates
   */
  public dates: Array<ResourceType | string> = [];

  /**
   * List of resources that will be
   */
  public resources: Array<ResourceResourceType> = [];

  /**
   * List of collectable columns that refer to other resources as array
   */
  public collectables: Array<ResourceResourceType> = [];

  /**
   * Determine if the inputs' value is not present in the data to be displayed in the response
   */
  public presented: boolean = true;

  /**
   * Determine if the inputs' value is set to be present but not in the data to be displayed as null
   */
  public nullable: boolean = false;

  /**
   * Resource Output
   */
  public output: any = {};

  /**
   * Asset url generator function
   */
  public assetFunction: Function = uploadsUrl;

  /**
   * Constructor
   * @param {object | ModelInterface<any>} data
   */
  public constructor(public data: any) {}

  /**
   * Convert resource when serialized as json
   */
  public toJSON(): any {
    this.parseInt();
    this.parseFloat();
    this.parseString();
    this.parseBoolean();
    this.parseResource();
    this.parseCollectables();
    this.parseAssets();
    this.parseDates();
    this.extend();

    return this.output;
  }

  /**
   * Do more operations
   */
  public extend(): void {}

  /**
   * Prepare the given column
   */
  public prepareColumn<T>(
    column: any,
    defaultValue: any = {}
  ): ResourceType | T {
    if (Is.string(column)) {
      column = {
        column,
        exportAs: column,
        presented: this.presented,
        nullable: this.nullable,
      };
    }

    if (Is.plainObject(column)) {
      column = {
        exportAs: column.column,
        presented: this.presented,
        nullable: this.nullable,
        ...column,
      };
    }

    return { ...defaultValue, column };
  }

  /**
   * Get the value of the given column name
   */
  public value(column: string): any {
    return Obj.get(this.data, column, null);
  }

  /**
   * Parse int columns
   */
  public parseInt(): JsonResource {
    for (let column of this.int) {
      column = this.prepareColumn(column);

      this.parseValue(column, parseInt, 0);
    }

    return this;
  }

  /**
   * Parse float columns
   */
  public parseFloat(): JsonResource {
    for (let column of this.int) {
      column = this.prepareColumn(column);

      this.parseValue(column, parseFloat, 0);
    }

    return this;
  }

  /**
   * Parse assets
   */
  public parseAssets(): JsonResource {
    for (let column of this.assets) {
      column = this.prepareColumn(column);

      this.parseValue(column, (value: any) => {
        let output: any;
        if (Is.array(value)) {
          output = [];
          for (let asset of value) {
            output.push(this.assetFunction(asset));
          }
        } else {
          output = this.assetFunction(value);
        }

        return output;
      });
    }

    return this;
  }

  /**
   * Parse dates
   */
  public parseDates(): JsonResource {
    for (let column of this.dates) {
      const dateColumn = this.prepareColumn(column, {
        format: "dd-MM-yyy",
        human: true,
        text: true,
      }) as ResourceDateType;

      this.parseValue(dateColumn, (value: any) => {
        let output: any = {};
        if (dateColumn.human) {
        }

        if (dateColumn.format !== false) {
          output.format = date(value).toFormat(
            dateColumn.format === true
              ? "dd-MM-yyy"
              : (dateColumn.format as string)
          );
        }

        return value;
      });
    }

    return this;
  }

  /**
   * Parse string columns
   */
  public parseString(): JsonResource {
    for (let column of this.string) {
      column = this.prepareColumn(column);

      this.parseValue(column, String, "");
    }

    return this;
  }

  /**
   * Parse boolean columns
   */
  public parseBoolean(): JsonResource {
    for (let column of this.boolean) {
      column = this.prepareColumn(column);

      this.parseValue(column, Boolean, false);
    }

    return this;
  }

  /**
   * Parse other resource columns
   */
  public parseResource(): JsonResource {
    for (let column of this.resources) {
      column = this.prepareColumn(column) as ResourceResourceType;

      this.parseValue(column, (value: any) => {
        return new column.resource(value).toJSON();
      });
    }

    return this;
  }

  /**
   * Parse other collectable columns
   */
  public parseCollectables(): JsonResource {
    for (let column of this.resources) {
      column = this.prepareColumn(column) as ResourceResourceType;
      this.parseValue(
        column,
        (value: any) => {
          if (Is.array(value)) {
            return value.map((value: any) =>
              new column.resource(value).toJSON()
            );
          }
          return [new column.resource(value).toJSON()];
        },
        []
      );
    }

    return this;
  }

  /**
   * Set the value for the given column based in the given callback
   */
  public parseValue(
    column: any,
    valueCallback: Function,
    defaultValue: any = null
  ): void {
    let value = this.value(column.column);

    if (value === null) {
      if (column.presented) {
        this.set(column.exportAs, column.nullable ? null : defaultValue);
      }
    } else {
      this.set(
        column.exportAs,
        column.parse ? column.parse(value) : valueCallback(value)
      );
    }
  }

  /**
   * Set the given value in the output list
   */
  public set(key: string, value: any) {
    Obj.set(this.output, key, value);
  }

  /**
   * Unset the given keys from the output list
   */
  public unset(...keys: string[]): JsonResource {
    for (let key of keys) {
      delete this.output[key];
    }

    return this;
  }
}
