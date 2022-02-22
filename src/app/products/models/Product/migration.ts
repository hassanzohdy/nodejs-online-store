import Blueprint from "core/db/Blueprint";
import Product, { ProductSchema } from "./index";

export async function migrateUniqueProductsEmailAndId() {
  const productBluePrint = Blueprint.of<ProductSchema>(Product.collection);

  await productBluePrint.unique("id").migrate("Creating id unique index.");
}
