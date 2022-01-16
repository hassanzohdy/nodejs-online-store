import express, { Request, Response } from "express";

const app = express();

const port: number = 3000;

app.get("/", (request: Request, response: Response) => {
  response.send("Welcome Home");
});

app.listen(port, () => {
  console.log("Server Started!");
});
