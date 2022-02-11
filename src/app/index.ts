import "./middleware";
import "./home";
import "./users";
// import "./categories";
import "./products";
import "./seeds";
import { formatDistance } from "date-fns";

import "./uploads";
import Model from "core/db/model";
import { user } from "core/auth/guard";
import User, { UserSchema } from "./users/models/User";
import database from "core/db";
import UserResource from "./users/resources/user-resource";
import Pipeline from "core/pipeline/pipeline";

Model.onModel("creating", (model: any) => {
  let currentUser = user() as User<UserSchema>;
  if (!currentUser) return;
  model.createdBy = currentUser.sharedData;
});

database.on("connection", async () => {
  //   let user = await User.last<User<UserSchema>>();
  //   let userResource = new UserResource(user);
  //   console.log(userResource.toJSON());
});
