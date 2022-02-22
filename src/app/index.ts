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
import { migrateAll } from "./migrations";
import Product, { ProductSchema } from "./products/models/Product";
import { log } from "core/log";

Model.onModel("creating", (model: any) => {
  let currentUser = user() as User<UserSchema>;
  if (!currentUser) return;
  model.createdBy = currentUser.sharedData;
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
