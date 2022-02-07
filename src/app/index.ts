import "./middleware";
import "./home";
import "./customers";
import "./products";
import "./seeds";
import database from "core/db";
import User from "./models/User";
import { log } from "core/log";

database.on("connection", () => {
  async function s() {
    log(await User.count());
  }

  s();
});
