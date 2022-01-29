import "./home";
import "./products";
import database from "core/db";
import { log } from "core/log";
import User from "./models/User";

database.on("connection", () => {
  async function test() {
    const user = new User();

    log(await user._.list());
  }
  test();
});
