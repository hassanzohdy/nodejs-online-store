import Validator from "core/validation";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import UploadedFile from "core/http/UploadedFile";
import User, { UserSchema } from "../models/User";

export default async function users(request: Request, response: Response) {
  // const users = await User._.latest().paginate({
  //   page: request.input("page", 1),
  // });
  const users = await User._.latest().limit(25).list();

  return response.success({
    records: users.map((user) => user.only("id", "name", "email")),
    // paginationInfo: users.info,
  });
}

export async function createUser(request: Request, response: Response) {
  const file = request.file("image") as UploadedFile;

  const userData = request.validated.all;

  if (file) {
    userData.image = await file.random.saveTo("images");
  }

  const user = await User.create(userData);

  return response.successCreate({
    record: user,
  });
}

createUser.validate = (validator: Validator) => {
  return validator.rules({
    name: "required",
    image: "image|length:1",
    email: "required|email|unique:users",
    password: "required|confirmed|minLength:8",
  });
};

class RestfulApiController {
  public create(request: Request, response: Response) {}
}

export async function updater(options: any = {}) {
  options = {
    model: User,
    rules: {
      name: "required",
      email: `required|email|unique:users:email`,
      password: "confirmed|minLength:8",
    },
  };

  return async function (request: Request, response: Response) {
    const record: any = await options.model.find(request.param("id"));

    if (!record) {
      return response.notFound({
        error: "Record Not Found in our database.",
      });
    }

    await record.save(request.validated.all);

    return response.success({
      record,
    });
  };
}

export const updateUser2 = updater({
  model: User,
  rules: {
    name: "required",
    email: `required|email|unique:users:email`,
    password: "confirmed|minLength:8",
  },
});

export async function updateUser(request: Request, response: Response) {
  const user = (await User.find(request.param("id"))) as User<UserSchema>;

  if (!user) {
    return response.notFound({
      error: "Record Not Found in our database.",
    });
  }

  await user.save(request.validated.all);

  return response.success({
    record: user,
  });
}

updateUser.validate = async (validator: Validator, request: Request) => {
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
