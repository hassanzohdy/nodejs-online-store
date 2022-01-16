import { Request, Response } from "express";

export default function HomeController(request: Request, response: Response) {
  response.send("Welcome Home From Controller");
}
