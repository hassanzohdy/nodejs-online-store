export type Hasher = {
  /**
   * Generate new hash for the given data
   */
  make(data: any): string;
  /**
   * Verify the given hashed text is matching the given value
   */
  verify(cipherText: string, matchingValue: any): boolean;
};
