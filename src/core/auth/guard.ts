import { authConfigurations } from "config";
import { ModelInterface } from "../db/model";

let currentUser: any = null;

export async function attempt(data: any): Promise<ModelInterface<any>> {
  const BaseModel = authConfigurations.guard!;
  // reset current user
  currentUser = null;

  currentUser = await BaseModel.first(data);

  return currentUser;
}

export function user(): ModelInterface<any> {
  return currentUser;
}
