import router from "core/router";
import { register, login } from "./controllers/auth";

router.post("/register", register);
router.post("/login", login);
