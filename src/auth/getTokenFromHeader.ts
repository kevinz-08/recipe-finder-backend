import { IncomingHttpHeaders } from "http";

const getTokenFromHeader = (
  headers: IncomingHttpHeaders
): string | null => {
  if (!headers || !headers.authorization) {
    return null;
  }

  const parted = headers.authorization.split(" ");

  if (parted.length !== 2) {
    return null;
  }

  if (parted[0] !== "Bearer") {
    return null;
  }

  return parted[1];
};

export default getTokenFromHeader;