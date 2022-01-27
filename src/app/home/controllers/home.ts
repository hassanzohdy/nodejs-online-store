import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import { log } from "core/log";
import User from "../../models/User";

export default async function HomeController(
  request: Request,
  response: Response
) {
  const user = new User();

  await user.insert([
    {
      id: 3,
      name: "Ali 2",
    },
    {
      id: 3,
      name: "Ali 3",
    },
  ]);

  const users = await user.handler
    .find({
      id: 3,
    })
    .toArray();

  response.send({
    records: users,
  });
}
