export type ResourceType = {
  /**
   * Column name that will be grabbed from the passed data
   */
  column: string;
  /**
   * Exported key to output, if not defined, it will be the same value of the column
   *
   * @default valueOf column
   */
  exportAs?: string;
  /**
   * If set to true and the column is not present in the resource data, then display the column anyway
   * either to be null if `nullable` is set to true, or to the default value of its corresponding type
   *
   * @default true
   */
  presented?: boolean;
  /**
   * If set to true and the column is set to be `presentable` and the column is not present in the resource data,
   * then display the column in the output with null value
   *
   * @default false
   */
  nullable?: boolean;
  /**
   * Determine if the column is expected to be array or not
   */
  asArray?: boolean;
  /**
   * Parse the column as you like, this will override the corresponding column type
   */
  parse?: (value: any) => any;
};

export type ResourceDateType = ResourceType & {
  /**
   * Set the format for the date column
   * If set to false, then the format key will not be presented in the column's object output
   *
   * @default "dd-MM-yyyy"
   */
  format?: string | boolean;
  /**
   * If set to true, then append `human` key the column's object output to display the distance between the date column and current time relatively
   *
   * @default true
   */
  human?: boolean;
  /**
   * If set to true, then append `text` key to the column's object output
   * Its value is based on the current localeCode of the app
   * i.e `Wednesday, 20th Feb 2022`
   */
  text?: boolean;
  /**
   * If set to true, then append `timestamp` key to the column's object output with the unix timestamp of
   * the date column
   */
  timestamp?: boolean;
};

export type ResourceResourceType = ResourceType & {
  /**
   * Define the resource class handler
   */
  resource: any;
};
