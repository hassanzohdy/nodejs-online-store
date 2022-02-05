export type ApplicationConfigurations = {
  /**
   * Application base url
   */
  baseUrl: string;
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
