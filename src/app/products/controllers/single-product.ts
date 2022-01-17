import { Request, Response } from "express";

export default function singleProductController(
  request: Request,
  response: Response
) {
  // request.params
  console.log(typeof request.params.id);
  response.send("Done");
}

// request.params
// request.headers
// request.query
// request.body
// request.files
