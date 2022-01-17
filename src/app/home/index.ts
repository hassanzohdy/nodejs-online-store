import { setRoutes } from "core/application";
import { Route } from "core/types/router";
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
