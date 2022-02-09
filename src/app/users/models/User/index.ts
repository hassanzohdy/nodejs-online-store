import database from "core/db";
import BasModel, { ModelInterface } from "core/db/model";
import { BaseSchema } from "core/db/types";
import AccessToken from "../AccessToken";

export type UserSchema = BaseSchema & {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  accessTokens?: string[];
};

export default class User<UserSchema>
  extends BasModel<UserSchema>
  implements ModelInterface<UserSchema>
{
  /**
   * {@inheritDoc}
   */
  public static collection: string = "users";
  /**
   * {@inheritDoc}
   */
  public get sharedData(): any {
    return this.only("id", "email", "name", "isActive");
  }

  /**
   * Log the user out
   */
  public async logout(accessToken?: string): Promise<User<UserSchema>> {
    if (!accessToken) return this;

    this.pullFrom("accessTokens", accessToken, "token");

    await AccessToken.expire(accessToken);

    return this;
  }
}

database.defineModel(User.collection, User);
