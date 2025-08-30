import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";

export const createToken = (account: any, expiresIn: any) => {
  return sign(
    {
      ...account, // Include all properties from account object
    },
    "secret",
    {
      expiresIn,
    }
  );
};
