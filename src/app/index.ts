import "./middleware";
import "./home";
import "./users";
// import "./categories";
import "./seeds";
import "./uploads";
import "./products";
import database from "core/db";
import Model from "core/db/model";
import { user } from "core/auth/guard";
import User, { UserSchema } from "./users/models/User";
import UserResource from "./users/resources/user-resource";

Model.onModel("creating", (model: any) => {
  let currentUser = user() as User<UserSchema>;
  if (!currentUser) return;
  model.createdBy = currentUser.sharedData;
});

// database.on("connection", async () => {
//   let user = await User.last<User<UserSchema>>();
//   console.log(user.toJSON());

//   //   let userResource = new UserResource(user);
//   //   console.log(userResource.toJSON());
// });
