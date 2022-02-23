import database from "core/db";
import AccessToken from "../AccessToken";
import { Obj } from "@mongez/reinforcements";
import { AttributesCasts, BaseSchema } from "core/db/types";
import BasModel, { ModelInterface } from "core/db/model";
import { AccessTokenSchema } from "../AccessToken/schema";
import UserResource from "../../resources/user-resource";

export type UserSchema = BaseSchema & {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  image?: string;
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
   * Resource Handler
   */
  protected resource: any = UserResource;

  /**
   * {@inheritDoc}
   */
  public get sharedData(): any {
    return this.only("id", "email", "name", "published", "image", "createdBy");
  }

  /**
   * {@inheritDoc}
   */
  protected casts: AttributesCasts = {
    image: "image",
    password: "password",
    published: "boolean",
  };

  /**
   * {@inheritdoc}
   */
  public static async create<T>(data: T | any): Promise<any> {
    data.accessTokens = [await AccessToken.generate()];

    return super.create(data);
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
