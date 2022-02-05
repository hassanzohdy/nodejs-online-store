import Blueprint from "core/db/Blueprint";
import AccessToken, { AccessTokenSchema } from ".";

export default async function migrateAccessToken() {
  const userBluePrint = Blueprint.of<AccessTokenSchema>(AccessToken.collection);

  await userBluePrint
    .unique("token")
    .migrate("Creating unique index for token column.");
}
