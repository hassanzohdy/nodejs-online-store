import { Request, Response } from "express";

export default function ContactUsController(
  request: Request,
  response: Response
) {
  response.json(request.body);
}
