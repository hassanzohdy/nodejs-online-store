import Is from "@mongez/supportive-is";
import { NextFunction, Request, Response } from "express";

function trimData(data: any) {
  if (!data) return data;
  if (Is.plainObject(data)) {
    for (let key in data) {
      let value = data[key];

      if (Is.plainObject(value)) {
        data[key] = trimData(value);
      } else if (Is.string(value)) {
        data[key] = value.trim();
      } else if (Is.array(value)) {
        data[key] = trimData(value);
      }
    }
  } else if (Is.array(data)) {
    for (let i = 0; i < data.length; i++) {
      let value = data[i];
      if (Is.array(value) || Is.plainObject(value)) {
        data[i] = trimData(value);
      } else {
        data[i] = value.trim();
      }
    }
  } else if (Is.string(data)) {
    data = data.trim();
  }

  return data;
}

export default function trimStrings(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  if (!Is.empty(request.body)) {
    request.body = trimData({ ...request.body });
  }

  if (!Is.empty(request.query)) {
    request.query = trimData({ ...request.query });
  }

  next();
}
