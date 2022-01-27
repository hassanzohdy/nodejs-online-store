import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import { log } from "core/log";
import User from "../../models/User";

export default async function HomeController(
  request: Request,
  response: Response
) {
  const user = new User();

  const users = await user.first({
    id: 1,
  });

  response.send({
    records: users,
  });
}
