import collect from "collect.js";
import { user } from "core/auth/guard";
import { ModelInterface } from "core/db/model";
import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import { log } from "core/log";
import User, { UserSchema } from "../../models/User";

export default async function HomeController(
  request: Request,
  response: Response
) {
  const data = await User._.where("id", ">", 15000).paginate({
    size: 20,
    page: 2,
  });

  data.records = data.records.map((user) => user.sharedData);

  response.send({
    records: data,
  });
}
