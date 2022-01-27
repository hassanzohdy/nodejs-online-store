import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import database from "core/db";

export default async function HomeController(
  request: Request,
  response: Response
) {
  console.log(database.isConnected());

  response.notFound("Welcome Home From Controller");
}
