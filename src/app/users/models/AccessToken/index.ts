import { jwt } from "core/auth";
import database from "core/db";
import Model from "core/db/model";
import { now } from "utils/date";
import request from "core/http/request";
import { SignOptions } from "jsonwebtoken";
import { DynamicObject } from "utils/types";
import { AccessTokenSchema } from "./schema";
import { Random } from "@mongez/reinforcements";

export default class AccessToken<Schema> extends Model<Schema> {
  /**
   * {@inheritDoc}
   */
  public static collection: string = "accessTokens";

  /**
   * Shared data
   */
  public get sharedData(): DynamicObject {
    return this.only("token");
  }

  /**
   * Generate access token
   */
  public static async generate(
    data?: any,
    options?: SignOptions
  ): Promise<DynamicObject> {
    if (!data) {
      data = {
        id: Random.string(96),
      };
    }

    const token: string = jwt.generate(data, options);

    const accessToken = await AccessToken.create<AccessTokenSchema>({
      token,
      ip: request.ip,
      userAgent: request.userAgent,
      expired: false,
      deviceId: request.header("device-id"),
    });

    return accessToken.sharedData;
  }

  /**
   * Expire the given token
   */
  public static async expire(token: string): Promise<any> {
    const accessToken: AccessToken<AccessTokenSchema> = await AccessToken.first(
      {
        token,
      }
    );

    if (!accessToken) return;

    accessToken.expired = true;
    accessToken.expiredAt = now();

    accessToken.save();
  }
}

database.defineModel(AccessToken.collection, AccessToken);
