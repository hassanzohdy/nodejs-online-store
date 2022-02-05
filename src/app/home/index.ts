import guarded from "core/auth/middleware/guarded";
import router from "core/router";
import ContactUsController from "./controllers/contact-us";
import HomeController from "./controllers/home";

router.get("/", HomeController).post("/contact-us", ContactUsController);
