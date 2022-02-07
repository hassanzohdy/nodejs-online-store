import router from "core/router";
import userSeeder from "./controllers/users-seeder";

router.get("/seed/users", userSeeder);
