import { Express, Request, Response } from "express";
import HomeController from "./home/controller/home";

export default function appRoutes(app: Express) {
  app.get("/", HomeController); // Request Method: GET
  app.get("/products", (request: Request, response: Response) => {
    response.send(request.query);
  });
}

// URL
// http schema >> http | https >> http
// ://
// www ?
// domain >> local host
// port >> 3000
// route /gmail
// query string ?welcome=hasan
// hash# ?welcome=hasan#user
// {httpSchema}(://)(www.?){domain}{port?}{route?}{query-string?}{#hash?}
