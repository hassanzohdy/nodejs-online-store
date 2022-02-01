import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import User from "../../models/User";

export default async function HomeController(
  request: Request,
  response: Response
) {
  // const user = new User();

  // const activeUsers = await user._.where("id", ">", 10).list();
  response.send({
    records: [],
  });
}
