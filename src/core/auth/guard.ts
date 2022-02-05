import { authConfigurations } from "config";

let currentUser: any = null;

export async function guarded(data: any): Promise<any> {
  const BaseModel = authConfigurations.guard!;

  currentUser = await BaseModel._.where(data).first();

  return currentUser;
}

export function user() {
  return currentUser;
}
