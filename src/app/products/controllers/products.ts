import { Request } from "core/http/types/request";
import { Response } from "core/http/response";

export default function ProductsController(
  request: Request,
  response: Response
) {
  response.send("Welcome To Products List");
}
