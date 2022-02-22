import database from "core/db";
import { UserSchema } from "app/users/models/User";
import { BaseSchema, Localized } from "core/db/types";
import BasModel, { ModelInterface } from "core/db/model";

export type ProductSchema = BaseSchema & {
  title: string;
  description: Localized;
  published?: boolean;
  image?: string;
  image2?: string;
  images?: string[];
  createdBy?: UserSchema;
  updatedBy?: UserSchema;
  price?: number;
  salePrice?: number;
  discount?: {
    type: "percentage" | "amount";
    value: number;
  };
};

export default class Product<ProductSchema>
  extends BasModel<ProductSchema>
  implements ModelInterface<ProductSchema>
{
  /**
   * {@inheritDoc}
   */
  public static collection: string = "products";

  /**
   * Resource Handler
   */
  protected resource: any;

  /**
   * {@inheritDoc}
   */
  public get sharedData(): any {
    return this.only("title", "image", "price", "salePrice", "discount");
  }
}

database.defineModel(Product.collection, Product);
