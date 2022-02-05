import request, { Request } from "core/http/request";
import { Response } from "core/http/response";
import { validate } from "@mongez/validator";
import Is from "@mongez/supportive-is";
import User, { UserSchema } from "../../models/User";
import hash from "core/hash";
import { jwt } from "core/auth";
import { attempt, user } from "core/auth/guard";
import { Random } from "@mongez/reinforcements";
import { log } from "core/log";

export async function register(request: Request, response: Response) {
  await User.truncate();
  const userData = request.only("email", "name", "password");

  log(request.only("email"));
  log(await User.first(request.only("email")));

  if (await User.first(request.only("email"))) {
    return response.badRequest({
      error: "You are already registered before, please login.",
    });
  }

  userData.password = hash.make(userData.password);

  const accessToken = jwt.generate(userData);

  userData.accessTokens = [accessToken];

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
  const userModel: User<UserSchema> = user();

  console.log(request.input("password"));

  if (
    !userModel ||
    !hash.verify(userModel.data.password, request.input("password"))
  ) {
    return response.unauthorized({
      error: "Invalid Login",
    });
  }

  const accessToken = jwt.generate({
    key: Random.string(96),
  });

  userModel.accessTokens.push(accessToken);

  await userModel.save();

  return response.success({
    record: {
      ...userModel.only("id", "name", "email"),
      accessToken,
    },
  });
}

class Validator {
  public inputs: any = {};
  public rulesMapping: any = {
    required: {
      required: true,
    },
    email: {
      type: "email",
    },
  };

  rules(rules: any): Validator {
    for (let input in rules) {
      let value = request.input(input);
      const inputRules = rules[input];
      this.inputs[input] = {
        value,
        rules: inputRules,
      };
    }

    return this;
  }

  scan() {
    for (let input in this.inputs) {
      const inputOptions = this.inputs[input];
      const convertedProps = this.mapRules(inputOptions.rules);
      const validator = validate(inputOptions.value, {}, []);
    }
  }

  public mapRules(rules: any): any {
    if (Is.string(rules)) {
      rules = rules.split("|");
    }

    let props = {};

    if (Is.array(rules)) {
    }
  }
}

register.validate = (
  validator: Validator,
  request: Request,
  response: Response
) => {
  //   const validator = new Validator();
  validator;
};
