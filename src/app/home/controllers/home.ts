import { Response } from "core/http/response";
import { Request } from "core/http/types/request";

export default function HomeController(request: Request, response: Response) {
  response.notFound("Welcome Home From Controller");
}
