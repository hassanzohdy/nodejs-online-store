import Blueprint from "core/db/Blueprint";
import User, { UserSchema } from "./index";

export async function migrateUniqueUsersEmailAndId() {
  const userBluePrint = Blueprint.of<UserSchema>(User.collection);

  await userBluePrint
    .unique("id")
    .unique("email")
    .migrate("Creating id and email unique index for each separately.");
}

export async function migrateUserAccessTokens() {
  const userBluePrint = Blueprint.of<UserSchema>(User.collection);

  await userBluePrint
    .unique("accessTokens")
    .migrate("Creating unique index for access tokens.");
}
