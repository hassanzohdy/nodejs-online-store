import { DateTime } from "luxon";

export type DynamicObject = {
  [key: string]: any;
};

export type CoreDate = Date | DateTime;
