export function log(text: string): any {
  console.log(text);
}

export function error(text: string): any {
  throw new Error(text);
}
