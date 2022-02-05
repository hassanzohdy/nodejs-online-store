import database from "core/db";
import Model from "core/db/model";
import { BaseSchema } from "core/db/types";

export type AccessTokenSchema = BaseSchema & {
  token: string;
};

export default class AccessToken<
  AccessTokenSchema
> extends Model<AccessTokenSchema> {
  /**
   * {@inheritDoc}
   */
  public static collection: string = "accessTokens";
}

database.defineModel(AccessToken.collection, AccessToken);
