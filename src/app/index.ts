import database from "core/db";
import applyMixins from "utils/mixins";
import "./home";
import User, { UserSchema } from "./models/User";
import "./products";

database.on("connection", () => {
  async function s() {
    const user = new User();

    user.setAttributes({
      name: "ok",
    });

    console.log(User.collection);

    // user.name = "hasan";

    // user.attributes = {
    //   noway: true,
    // };

    // user.allow = true;

    // await user.save();

    // console.log(user.attributes);
  }
  s();
});
