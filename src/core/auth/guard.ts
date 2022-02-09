import { authConfigurations } from "config";
import { ModelInterface } from "../db/model";
import request from "../http/request";

let currentUser: any = null;

/**
 * Attempt to login to the app using the given data
 * If success, then create an auth user for the current request
 */
export async function attempt(data: any): Promise<ModelInterface<any>> {
  const BaseModel = authConfigurations.guard!;

  authLogout();

  currentUser = await BaseModel.first(data);

  return currentUser;
}

/**
 * Get current user model or null if no user is logged in
 */
export function user<T>(): T | ModelInterface<any> {
  return currentUser;
}

/**
 * Log the user out from the auth cycle
 */
export function authLogout(): void {
  currentUser = null;
}
