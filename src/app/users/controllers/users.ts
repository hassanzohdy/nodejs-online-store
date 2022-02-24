import Validator from "core/validation";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import UploadedFile from "core/http/UploadedFile";
import User, { UserSchema } from "../models/User";

export default async function users(request: Request, response: Response) {
  const orderBy = request.input("orderBy", "id");
  const sortOrder = request.input("sortOrder", "desc");
  const query = User._.orderBy({
    [orderBy]: sortOrder,
  });

  console.log("Updating published state");

  for (let user of await User.list<User<UserSchema>>()) {
    user.published = true;
    await user.save();
  }

  const email = request.input("email");
  const name = request.input("name");
  const id = request.input("id");

  if (email) {
    query.whereLike("email", email);
  }

  if (name) {
    query.whereLike("name", name);
  }

  if (id) {
    query.where("id", id);
  }

  const users = await query.paginate({
    page: request.input("page", 1),
    size: request.input("size", 25),
  });

  return response.success({
    records: users.records,
    paginationInfo: users.info,
  });
}

export async function createUser(request: Request, response: Response) {
  const file = request.file("image") as UploadedFile;

  const user = await User.create(request.validated.all);

  return response.successCreate({
    record: user,
  });
}

createUser.validate = (validator: Validator) => {
  return validator.rules({
    name: "required",
    image: "required|image|length:1",
    email: "required|email|unique:users",
    password: "required|confirmed|minLength:8",
    published: "checkbox",
  });
};

class RestfulApiController {
  public async create(request: Request, response: Response) {}

  public async createValidate(
    validator: Validator,
    request: Request,
    response: Response
  ) {}
}

export async function updater(options: any = {}) {
  options = {
    model: User,
    rules(request: Request) {
      return {
        name: "required",
        email: `required|email|unique:users:email`,
        password: "confirmed|minLength:8",
      };
    },
  };

  const handler = async function (request: Request, response: Response) {
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

  handler.validate = async (validator: Validator, request: Request) => {
    return validator.rules(options.rules(request));
  };

  return handler;
}

export const updateUser2 = updater({
  model: User,
  rules(request: Request) {
    return {
      name: "required",
      email: `required|email|unique:users:email`,
      password: "confirmed|minLength:8",
    };
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
    image: "image|length:1",
    published: "checkbox",
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
