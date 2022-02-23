import { Command as CommanderCommand } from "commander";

export type Command =
  //    CommanderCommand |
  {
    /**
     * Command name alongside with its arguments and options
     */
    name: string;
    /**
     * Command Description
     */
    description: string;
    /**
     * Handle the command
     */
    handle: any;
    /**
     * Command options
     */
    options?: {
      /**
       * Option name
       */
      name: string;
      /**
       * Option description
       */
      description?: string;
      /**
       * Option default value
       */
      defaultValue?: any;
    }[];
  };
