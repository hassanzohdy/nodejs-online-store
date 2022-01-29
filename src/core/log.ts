import Is from "@mongez/supportive-is";
import * as util from "util";

export function log(text: any): any {
  console.log(
    Is.object(text)
      ? util.inspect(text, {
          showHidden: true,
          depth: null,
          colors: true,
          breakLength: 4,
        })
      : text
  );
}

export function error(text: string): any {
  throw new Error(text);
}
