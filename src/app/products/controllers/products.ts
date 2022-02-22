import { Request } from "core/http/request";
import { Response } from "core/http/response";
import User from "../../users/models/User";
import Product, { ProductSchema } from "../models/Product";

export default async function ProductsController(
  request: Request,
  response: Response
) {
  const user = await User.first();

  let p = await Product.create<ProductSchema>({
    title: "My Product",
    description: [
      {
        localeCode: "en",
        text: "Description",
      },
    ],
    createdBy: user,
  });

  response.send("Welcome To Products List");
}
