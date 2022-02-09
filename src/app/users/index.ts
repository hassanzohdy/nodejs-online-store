import router from "core/router";
import { register, login, logout } from "./controllers/auth";

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
