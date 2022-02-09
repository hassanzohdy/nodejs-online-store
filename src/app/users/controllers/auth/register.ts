import hash from "core/hash";
import Validator from "core/validation";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import AccessToken from "app/users/models/AccessToken";
import User, { UserSchema } from "app/users/models/User";

export default async function register(request: Request, response: Response) {
  const userData = request.only("email", "name", "password");

  const user = await User.create<UserSchema>(userData);

  return response.successCreate({
    record: {
      ...user.toJSON(),
      accessToken: user.currentToken,
    },
  });
}

register.validate = (validator: Validator): Validator => {
  return validator.rules({
    email: "required|email|unique:users",
    name: "required",
    password: "required",
  });
};
