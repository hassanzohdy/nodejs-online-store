import router from "core/router";
import login from "./controllers/auth/login";
import logout from "./controllers/auth/logout";
import register from "./controllers/auth/register";
import users, { createUser, deleteUser, updateUser } from "./controllers/users";

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

router.get("/users", users);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
