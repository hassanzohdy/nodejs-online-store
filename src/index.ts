import express, { Request, Response } from "express";
import root, { src, utils } from "utils/path";

const app = express();

console.log(utils());

const port: number = 3000;

app.get("/", (request: Request, response: Response) => {
  response.send(request.query);
});

app.listen(port, () => {
  console.log("Server Started!");
});
