import { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { DynamicObject } from "utils/types";

export type AccessToken = {
  /**
   * Generate new access token
   */
  generate(
    payload: DynamicObject,
    expiresIn?: string | number | undefined,
    moreOptions?: SignOptions
  ): string;
  /**
   * Verify the given cipher token and return the payload
   */
  verify(
    cipherText: string,
    options?: VerifyOptions
  ): JwtPayload | string | null;
  /**
   * Generate a refresh token for the given access token
   */
  refreshToken(
    accessToken: string,
    expiresIn?: string | number | undefined,
    refreshOptions?: SignOptions
  ): string | null;
};
