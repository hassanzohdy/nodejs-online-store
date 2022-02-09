import hash from "core/hash";
import database from "core/db";
import AccessToken from "../AccessToken";
import { BaseSchema } from "core/db/types";
import { Obj } from "@mongez/reinforcements";
import BasModel, { ModelInterface } from "core/db/model";
import { AccessTokenSchema } from "../AccessToken/schema";

export type UserSchema = BaseSchema & {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  accessTokens?: AccessTokenSchema[];
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
    return this.only("id", "email", "name");
  }

  /**
   * {@inheritdoc}
   */
  public toJSON(): any {
    return this.sharedData;
  }

  /**
   * {@inheritdoc}
   */
  public static async create<T>(data: T | any): Promise<any> {
    data.accessTokens = [await AccessToken.generate()];

    data.password = hash.make(data.password);

    return super.create(data);
  }

  /**
   * {@inheritDoc}
   */
  public async save(attributes?: any): Promise<any> {
    if (attributes?.password) {
      attributes.password = hash.make(attributes.password);
    }

    return super.save(attributes);
  }

  /**
   * Get current user access token
   */
  public get currentToken(): string {
    const accessTokens = this.getAttribute("accessTokens", []);

    return Obj.get(accessTokens, `${accessTokens.length - 1}.token`);
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
