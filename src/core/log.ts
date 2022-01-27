export function log(text: any): any {
  console.log(text);
}

export function error(text: string): any {
  throw new Error(text);
}
