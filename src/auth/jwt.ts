import jwt from "jsonwebtoken";
import { env } from "../config/env";
import {
  TokenExpiry,
  DEFAULT_TOKEN_EXPIRES_IN,
  TokenExpiryKey,
} from "../shared/constants";

export class JWT {
  static sign(
    payload: any,
    expiresIn: TokenExpiryKey = DEFAULT_TOKEN_EXPIRES_IN
  ) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: TokenExpiry[expiresIn],
    });
  }

  static verify(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch {
      return null;
    }
  }
}
