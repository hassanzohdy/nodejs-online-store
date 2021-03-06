import * as path from "path";

export default function root(...paths: string[]): string {
  return path.resolve(process.cwd(), ...paths);
}

export function appPath(...paths: string[]) {
  return root("src/app", ...paths);
}

export function configPath() {
  return root("src/config");
}

export function src() {
  return root("src");
}

export function utils() {
  return root("src/utils");
}
