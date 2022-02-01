import database from "core/db";
import BasModel from "core/db/model";
import { BaseSchema } from "core/db/types";

export type UserSchema = BaseSchema & {
  name?: string;
  password?: string;
  email?: string;
  isActive?: boolean;
};

class Model<UserSchema> extends BasModel<UserSchema> {
  /**
   * {@inheritDoc}
   */
  public static collection: string = "users";
}

const User = Model;

database.defineModel(Model.collection, Model);

export default User;
