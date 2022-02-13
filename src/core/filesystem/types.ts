export type StorageConfigurations = {
  /**
   * Root Path
   */
  root: string;
  /**
   * Temp Directory
   */
  temp: string;
  /**
   * Uploads Directory
   */
  uploads: string;
  /**
   * Uploads route
   */
  uploadsRoute: string;
  /**
   * uploads url function, it takes the relative path and return the full url
   */
  uploadsUrl: (path: string) => string;
};
