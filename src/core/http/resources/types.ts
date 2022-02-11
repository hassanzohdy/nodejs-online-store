export type ResourceType = {
  column: string;
  exportAs?: string;
  presented?: boolean;
  nullable?: boolean;
  asArray?: boolean;
  parse?: (value: any) => any;
};

export type ResourceDateType = ResourceType & {
  format?: string | boolean;
  human?: boolean;
  text?: boolean;
  timestamp?: boolean;
};

export type ResourceResourceType = ResourceType & {
  resource: any;
};
