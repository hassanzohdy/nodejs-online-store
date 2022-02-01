import { Hasher } from "./types";
import { decrypt, encrypt } from "@mongez/encryption";

const hash: Hasher = {
  make(data: any): string {
    return encrypt(data);
  },
  verify(cipherText: string, data: any): boolean {
    return decrypt(cipherText) === data;
  },
};

export default hash;
