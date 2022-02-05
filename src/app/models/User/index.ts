import database from "core/db";
import BasModel from "core/db/model";
import { BaseSchema } from "core/db/types";

export type UserSchema = BaseSchema & {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  accessTokens?: string[];
};

export default class User<UserSchema> extends BasModel<UserSchema> {
  /**
   * {@inheritDoc}
   */
  public static collection: string = "users";
}

database.defineModel(User.collection, User);
