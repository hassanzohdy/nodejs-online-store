import { Route } from "core/router";
import { setRoutes } from "core/router";
import ContactUsController from "./controllers/contact-us";
import HomeController from "./controllers/home";

const routes: Route[] = [
  {
    path: "/",
    handler: HomeController,
  },
  {
    path: "/contact-us",
    method: "post",
    handler: ContactUsController,
  },
];

setRoutes(routes);
