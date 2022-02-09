import request, { Request } from "core/http/request";
import { Response } from "core/http/response";
import { validate } from "@mongez/validator";
import Is from "@mongez/supportive-is";
import User, { UserSchema } from "../models/User";
import hash from "core/hash";
import { jwt } from "core/auth";
import { attempt, authLogout, user } from "core/auth/guard";
import { Random } from "@mongez/reinforcements";
import AccessToken from "../models/AccessToken";

export async function register(request: Request, response: Response) {
  const userData = request.only("email", "name", "password");

  if (await User.first(request.only("email"))) {
    return response.badRequest({
      error: "You are already registered before, please login.",
    });
  }

  userData.password = hash.make(userData.password);

  const accessToken = jwt.generate(userData);

  userData.accessTokens = [await AccessToken.generate()];

  const user = await User.create<UserSchema>(userData);

  return response.success({
    _records: await User.list(),
    record: {
      ...user.only("id", "name", "email"),
      accessToken,
    },
  });
}

export async function login(request: Request, response: Response) {
  await attempt(request.only("email"));
  const userModel = user<User<UserSchema>>();

  if (
    !userModel ||
    !hash.verify(userModel.data.password, request.input("password"))
  ) {
    return response.unauthorized({
      error: "Invalid Login",
    });
  }

  const accessToken = await AccessToken.generate();

  userModel.accessTokens.push(accessToken);

  await userModel.save();

  return response.success({
    record: {
      ...userModel.only("id", "name", "email"),
      accessToken,
    },
  });
}

register.validate = (request: Request, response: Response) => {};

export async function logout(request: Request, response: Response) {
  const currentUser: any = user();

  if (!currentUser) return;

  await (
    await currentUser.logout(request.authorization("Bearer") as string)
  ).save();

  authLogout();

  return response.success({
    success: true,
  });
}
