import fs from "@mongez/fs";
import { cwd } from "process";
import Is from "@mongez/supportive-is";
import { Obj, trim } from "@mongez/reinforcements";

let envData: any = {};

function parseLine(line: string): void {
  line = line.trim();
  if (!line || line.startsWith("#") || !line.includes("=")) return;

  let [key, value] = line.split("=") as any;

  envData[key] = parseValue(value);
}

function parseValue(value: any): any {
  // trim any double quotes
  value = trim(value, '"');

  if (value.includes("${")) {
    value = value.replace(
      /\$\{([^\{]+)\}/g,
      (a: any, b: any, c: any, d: any) => {
        return envData[b];
      }
    );
  }

  if (Is.numeric(value)) {
    value = Number(value);
  } else if (value === "null") {
    value = null;
  } else if (value === "true") {
    value = true;
  } else if (value === "false") {
    value = false;
  }

  return value;
}

/**
 * Load data from file and set the env data from that file
 */
export function loadEnv(envPath?: string): void {
  if (!envPath) {
    envPath = cwd() + "/.env";
  }

  const lines: string[] = fs.get(envPath).split(/\n|\r\n/);

  for (const line of lines) {
    parseLine(line);
  }
}

export function env(key: string, defaultValue?: null): any {
  return Obj.get(envData, key, defaultValue);
}
