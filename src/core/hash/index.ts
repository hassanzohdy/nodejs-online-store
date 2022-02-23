import bcrypt from "bcryptjs";
import { Hasher } from "./types";

const salt = 10;

const hash: Hasher = {
  make(data: any): string {
    return bcrypt.hashSync(String(data), salt);
  },
  verify(cipherText: string, data: any): boolean {
    return bcrypt.compareSync(String(data), cipherText);
  },
};

export default hash;
