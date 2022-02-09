import { ModelsList } from "./types";

export const modelsList: ModelsList = {};

/**
 * Get an instance of model
 */
export function newModel(modelCollection: any, record: any = {}): any {
  return new modelsList[modelCollection](record);
}
