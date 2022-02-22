import migrateInformationSchema from "core/db/migrations/migrateInformationSchema";
import migrateAccessToken from "./users/models/AccessToken/migration";
import {
  migrateUniqueUsersEmailAndId,
  migrateUserAccessTokens,
} from "app/users/models/User/migration";
import { migrateUniqueProductsEmailAndId } from "./products/models/Product/migration";

export async function migrateAll() {
  // Information Schema
  await migrateInformationSchema();

  // User
  await migrateAccessToken();
  await migrateUniqueUsersEmailAndId();
  await migrateUserAccessTokens();

  // Products
  await migrateUniqueProductsEmailAndId();
}
