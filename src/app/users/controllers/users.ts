import { Request } from "core/http/request";
import { Response } from "core/http/response";
import User from "../models/User";

export default async function users(request: Request, response: Response) {
  const users = await User._.paginate();

  return response.success({
    records: users.records,
    paginationInfo: users.info,
  });
}
