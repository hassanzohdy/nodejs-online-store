import { Response } from "core/http/response";
import { Request } from "core/http/types/request";
import faker from "@faker-js/faker";
import User from "../../models/User";
import hash from "core/hash";
import { jwt } from "core/auth";
import { Random } from "@mongez/reinforcements";

export default async function fake(request: Request, response: Response) {
  const data: any[] = [];

  let total: number = 0;

  for (let i = 0; i < 200000; i++) {
    const email = faker.internet.email;
    if (
      await User.first({
        email,
      })
    )
      continue;

    data.push(
      await User.create({
        name: faker.internet.userName,
        email: email,
        password: hash.make(faker.internet.password),
        accessTokens: [
          jwt.generate({
            key: Random.string(96),
          }),
        ],
      })
    );

    total++;

    console.log("Created " + total + " Records");
  }

  response.send({
    records: data,
  });
}
