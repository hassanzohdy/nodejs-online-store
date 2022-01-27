import { Request } from "core/http/types/request";
import { Response } from "core/http/response";

export default function singleProductController(
  request: Request,
  response: Response
) {
  response.send({
    success: true,
  });
}
