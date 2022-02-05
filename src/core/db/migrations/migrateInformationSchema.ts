import Blueprint from "../Blueprint";
import { DatabaseManager } from "../DatabaseManager";

export default async function migrateInformationSchema() {
  const blueprint = Blueprint.of<any>(DatabaseManager.collection);

  await blueprint
    .unique("collection")
    .migrate("Create unique index for collection");
}
