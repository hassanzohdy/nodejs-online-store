import { Request } from "core/http/types/request";
import { Response } from "express";

export default function singleProductController(
  request: Request,
  response: Response
) {
  response.send({
    success: true,
  });
}

// request.params
// request.headers
// request.query
// request.body
// request.files
