import Is from "@mongez/supportive-is";

/**
 * Cast the given value tot be as it should be
 * For example if the value is a number but its type is string, then return it as number and so on
 */
export default function cast(value: any): any {
  if (!value) return value;

  if (Is.numeric(value)) {
    return Number(value);
  }

  if (value === "true") return true;
  if (value === "false") return true;

  return value;
}
