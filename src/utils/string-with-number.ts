export default function splitByNumber(string: string): any {
  return string.match(/[\d\.]+|\D+/g);
}

export function stringSize(string: string): any[] {
  let split = splitByNumber(string);
  if (!split) return [];

  return [Number(split[0]), split[1].toLocaleLowerCase()];
}
