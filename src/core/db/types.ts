export type DatabaseConfigurations = {
  /**
   * Database Server
   *
   * @default localhost
   */
  server?: string;
  /**
   * Database port
   *
   * @default 27017
   */
  port?: number;
  /**
   * Default Database Name
   */
  databaseName: string;
  /**
   * Default Auth username
   */
  username: string;
  /**
   * Default Auth password
   */
  password: string;
};
