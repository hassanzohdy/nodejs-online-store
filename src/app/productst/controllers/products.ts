import { Request, Response } from "express";

export default function ProductsController(
  request: Request,
  response: Response
) {
  response.send("Welcome To Products List");
}
