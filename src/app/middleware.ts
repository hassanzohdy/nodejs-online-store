import cors from "cors";
import { log } from "core/log";
import auth from "core/auth/middleware/auth";
import guarded from "core/auth/middleware/guarded";
import middlewareList from "core/router/middleware";
import { NextFunction, Request, Response } from "express";
import Is from "@mongez/supportive-is";
import { Obj } from "@mongez/reinforcements";

function logRequest(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  log(request.url);
  log(request.baseUrl);

  next();
}

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

function trimStrings(
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

middlewareList.add([cors(), trimStrings, logRequest, auth]);
