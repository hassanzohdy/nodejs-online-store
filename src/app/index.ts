import "./middleware";
import "./home";
import "./users";
// import "./categories";
import "./seeds";
import "./uploads";
import "./products";
import database from "core/db";
import Model from "core/db/model";
import { authLogout, user } from "core/auth/guard";
import User, { UserSchema } from "./users/models/User";
import UserResource from "./users/resources/user-resource";
import { migrateAll } from "./migrations";
import Product, { ProductSchema } from "./products/models/Product";
import { log } from "core/log";
import response from "core/http/response";

Model.onModel("creating", (model: any) => {
  let currentUser = user() as User<UserSchema>;
  if (!currentUser) return;
  model.createdBy = currentUser.sharedData;
});

response.on("success", (response: any) => {
  let currentUser = user() as User<UserSchema>;
  if (!currentUser) return;

  console.log("Success Response");

  response.user = currentUser;
});

response.on("send", () => {
  authLogout();
  console.log("Sent Response");
});

database.on("connection", async () => {
  // let ps: any = await Product.first();
  // log(ps.createdBy);
  // return;
  // const user = await User.first();
  // let p = await Product.create<ProductSchema>({
  //   title: "My Product",
  //   description: [
  //     {
  //       localeCode: "en",
  //       text: "Description",
  //     },
  //   ],
  //   createdBy: user.sharedData,
  // });
  // console.log(p);
});
