import { DynamicObject } from "utils/types";
import { AccessToken } from "./types/accessToken";
import BaseJWT, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { authConfigurations } from "config";

export const jwt: AccessToken = {
  /**
   * Generate new access token
   */
  generate(payload: DynamicObject, moreOptions: SignOptions = {}): string {
    return BaseJWT.sign(payload, authConfigurations.secretKey!, moreOptions);
  },
  /**
   * Verify the given cipher token and return the payload
   */
  verify(
    cipherText: string,
    options?: VerifyOptions
  ): JwtPayload | string | null {
    try {
      return BaseJWT.verify(cipherText, authConfigurations.secretKey!, options);
    } catch (error) {
      return null;
    }
  },
  /**
   * Generate a refresh token for the given access token
   */
  refreshToken(
    accessToken: string,
    refreshOptions?: SignOptions
  ): string | null {
    const payload = jwt.verify(accessToken) as JwtPayload;

    if (!payload) return null;

    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;

    return jwt.generate(payload, refreshOptions);
  },
};
