import "./home";
import "./products";
import database from "core/db";
import migrateAccessToken from "./models/AccessToken/migration";
import {
  migrateUniqueUsersEmailAndId,
  migrateUserAccessTokens,
} from "./models/User/migration";
import migrateInformationSchema from "core/db/migrations/migrateInformationSchema";
import Model from "core/db/model";
import { log } from "core/log";
import User, { UserSchema } from "./models/User";
import { jwt } from "core/auth";
import hash from "core/hash";
import faker from "@faker-js/faker";

database.on("connection", () => {
  async function s() {
    // const user = await auth({
    //   name: "hasan",
    // });
    // log(user);
  }
  // s();

  fake();
});

async function fake() {
  const oneThousand = 20000000;
  let t = 0;

  for (let i = 0; i < oneThousand; i++) {
    try {
      await User.create<UserSchema>({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: hash.make(faker.internet.password()),
      });
      t++;
      console.log(`Created ${t} records`);
    } catch (error) {
      log(error);
      continue;
    }
  }

  log("All Done..");

  // await migrateAll();
}

async function migrateAll() {
  await migrateInformationSchema();
  await migrateAccessToken();
  await migrateUniqueUsersEmailAndId();
  await migrateUserAccessTokens();
}
