import { attempt } from "core/auth/guard";
import hash from "core/hash";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import Validator from "core/validation";
import AccessToken from "app/users/models/AccessToken";
import User, { UserSchema } from "app/users/models/User";

export default async function login(request: Request, response: Response) {
  const user = await attempt<User<UserSchema>>(request.only("email"));

  if (!user || !hash.verify(user.data.password, request.input("password"))) {
    return response.unauthorized({
      error: "Invalid Login",
    });
  }

  const accessToken = await AccessToken.generate();

  user.accessTokens.push(accessToken);

  await user.save();

  return response.success({
    record: {
      ...user.only("id", "name", "email"),
      accessToken: accessToken.token,
    },
  });
}

/**
 * Validation
 */
login.validate = (validator: Validator) => {
  return validator.rules({
    email: "required|exists:users",
    password: "required",
  });
};
