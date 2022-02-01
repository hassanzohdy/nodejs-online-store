import database from "core/db";
import "./home";
import User, { UserSchema } from "./models/User";
import "./products";

database.on("connection", () => {
  async function s() {
    const m = await User.find<UserSchema>(1);

    if (!m) return;

    console.log(m.name);
  }

  s();
});
