import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenUtilInterface {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload;
}

class TokensUtil implements TokenUtilInterface {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  public generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret);
  }

  public verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      throw new Error("Invalid token");
    }
  }
}

export default TokensUtil;
