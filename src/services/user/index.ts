import APIError from "../../utils/errors";
import TokensUtil from "../../utils/tokens-util";

interface IUserService {
  login: (username: string, password: string) => string | undefined;
  authorize: (token: string) => void;
}

class UserService implements IUserService {
  private tokensUtil: TokensUtil;
  constructor() {
    this.tokensUtil = new TokensUtil(process.env.JWT_SECRET!);
  }
  login(username: string, password: string): string | undefined {
    try {
      if (
        username === process.env.USERNAME &&
        password === process.env.PASSWORD
      ) {
        const token = this.tokensUtil.generateToken({ username });
        return token;
      }
      throw new APIError({
        code: 400,
        label: "AUTHENTICATION_FAILED",
        description: "Invalid username or password",
      });
    } catch (err: any) {
      throw err;
    }
  }
  authorize(token: string): void {
    try {
      this.tokensUtil.verifyToken(token);
      throw new APIError({
        code: 401,
        label: "UNAUTHORIZED",
        description: "invalid token",
      });
    } catch (err: any) {
      throw err;
    }
  }
}

const userService = new UserService();

export default userService;
