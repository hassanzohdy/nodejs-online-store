import { Request } from "core/http/types/request";
import { Response } from "express";

export default function HomeController(request: Request, response: Response) {
  console.log(request.only("age"));
  response.send("Welcome Home From Controller");
}
