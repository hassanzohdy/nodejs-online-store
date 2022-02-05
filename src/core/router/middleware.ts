import Is from "@mongez/supportive-is";
import { RequestMiddleware } from "./types";

let storedMiddleware: RequestMiddleware[] = [];

const middlewareList = {
  add(middleware: RequestMiddleware | RequestMiddleware[]): void {
    if (Is.array(middleware)) {
      storedMiddleware = [...storedMiddleware, ...middleware];
    } else {
      storedMiddleware.push(middleware);
    }
  },
  list(): RequestMiddleware[] {
    return storedMiddleware;
  },
};

export default middlewareList;
