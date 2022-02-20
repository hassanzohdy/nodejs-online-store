import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import faker from "@faker-js/faker";
import User from "app/users/models/User";
import hash from "core/hash";
import { log } from "core/log";

export default async function userSeeder(request: Request, response: Response) {
  const data: any[] = [];

  let total: number = 0;

  for (let i = 0; i < 10000; i++) {
    log(`Creating ${i + 1} Record...`);
    const email = faker.internet.email();
    if (
      await User.first({
        email,
      })
    ) {
      console.log(email);
      continue;
    }

    await User.create({
      name: faker.internet.userName(),
      email: email,
      password: hash.make(faker.internet.password()),
    });

    total++;

    console.log("Created " + total + " Records");
  }

  response.send({
    records: await User._.count(),
  });
}
