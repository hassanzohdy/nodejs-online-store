import migrateInformationSchema from "core/db/migrations/migrateInformationSchema";
import migrateAccessToken from "./models/AccessToken/migration";
import {
  migrateUniqueUsersEmailAndId,
  migrateUserAccessTokens,
} from "./models/User/migration";

export async function migrateAll() {
  await migrateInformationSchema();
  await migrateAccessToken();
  await migrateUniqueUsersEmailAndId();
  await migrateUserAccessTokens();
}
