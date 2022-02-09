import { BaseSchema } from "core/db/types";
import { CoreDate } from "utils/types";

export type AccessTokenSchema = BaseSchema & {
  /**
   * Access token
   */
  token: string;
  /**
   * Client ip
   */
  ip?: string;
  /**
   * Client device id
   */
  deviceId?: string;
  /**
   * Client user agent
   */
  userAgent?: string;
  /**
   * Access token state
   */
  expired?: boolean;
  /**
   * Expired at
   */
  expiredAt?: CoreDate;
};
