import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import database from "core/db";
import { log } from "core/log";

export default async function HomeController(
  request: Request,
  response: Response
) {
  const users = database.collection("users");

  await users.insertOne({
    id: 1,
    name: "hasan",
    email: "hassanzohdy@gmail.com",
    password: "123123123",
  });

  log("User Has Been Created Successfully");

  // await users.deleteOne({
  //   id: 1,
  // });

  log(await users.find({}).toArray());

  response.notFound("Welcome Home From Controller");
}
