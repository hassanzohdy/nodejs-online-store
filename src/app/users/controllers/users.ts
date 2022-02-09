import { Request } from "core/http/request";
import { Response } from "core/http/response";
import Validator from "core/validation";
import AccessToken from "../models/AccessToken";
import User, { UserSchema } from "../models/User";

export default async function users(request: Request, response: Response) {
  const users = await User._.paginate();

  return response.success({
    records: users.records.map((user) => user.only("id", "name", "email")),
    paginationInfo: users.info,
  });
}

export async function createUser(request: Request, response: Response) {
  const user = await User.create(request.validated.all);

  return response.successCreate({
    record: user,
  });
}

createUser.validate = (validator: Validator) => {
  return validator.rules({
    name: "required",
    email: "required|email|unique:users",
    password: "required|confirmed|minLength:8",
  });
};

export async function updateUser(request: Request, response: Response) {
  const user = (await User.find(request.param("id"))) as User<UserSchema>;

  await user.save(request.validated.all);

  return response.success({
    record: user,
  });
}

updateUser.validate = (validator: Validator, request: Request) => {
  return validator.rules({
    name: "required",
    email: `required|email|unique:users:email:${request.param("id")}`,
    password: "confirmed|minLength:8",
  });
};

export async function deleteUser(request: Request, response: Response) {
  const user = await User.find(request.param("id"));
  if (user === null) {
    return response.notFound({
      error: "Not Found record",
    });
  }

  await user.destroy();

  return response.success({
    success: true,
  });
}
