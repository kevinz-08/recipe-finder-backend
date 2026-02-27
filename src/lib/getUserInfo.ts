import { UserDocument } from "../schema/user";
import { JwtUserPayload } from "../auth/generateTokens";

function getUserInfo(user: UserDocument): JwtUserPayload {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}

export default getUserInfo;