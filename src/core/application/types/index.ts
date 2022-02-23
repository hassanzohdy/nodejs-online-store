export type ApplicationConfigurations = {
  /**
   * Application base url
   */
  baseUrl: string;
  /**
   * App path, usually / if the app is in the root
   */
  appPath: string;
  /**
   * Application port
   */
  port: number;
  /**
   * App locale code
   */
  locale: string;
  /**
   * Date configurations
   */
  date?: {
    timezone?: string;
    /**
     * @see https://moment.github.io/luxon/#/parsing?id=table-of-tokens
     */
    format?: string;
  };
};

export type StartAppOptions = {
  /**
   * If set to true, then database will automatically try to connect
   */
  database?: boolean;
  /**
   * If set to true, then router will start scanning for routing.
   * This is useful to be false when needing to run the application as cli only
   */
  router?: boolean;
};
