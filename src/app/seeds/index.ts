import router from "core/router";
import userSeeder from "./controllers/fake";

router.get("/seed/users", userSeeder);
