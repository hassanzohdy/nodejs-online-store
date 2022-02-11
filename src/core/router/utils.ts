import concatRoute from "@mongez/concat-route";
import { applicationConfigurations } from "config";

/**
 * Get full url for the given route(s)
 */
export function url(...routes: string[]): string {
  return (
    applicationConfigurations.baseUrl +
    concatRoute(applicationConfigurations.appPath, ...routes)
  );
}

/**
 * Get url for uploads directory
 */
export function uploadsUrl(path: string): string {
  return url("/uploads", path);
}
