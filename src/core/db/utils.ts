import { DatabaseOperator, OperatorsList } from "./types";

/**
 * Operators list, the left side is the human readable operator, the right side is MongoDB operator
 */
const operators: OperatorsList = {
  "=": "$eq",
  ">": "$gt",
  ">=": "$gte",
  "<": "$lt",
  "<=": "$lte",
  in: "$in",
  notIn: "$nin",
  "!=": "$ne",
  not: "$ne",
};

/**
 * Parse the given operator into a proper MongoDB operator
 */
export function parseOperator(operator: DatabaseOperator): string {
  if (!operators[operator]) {
    throw new Error(
      `Unknown Operator ${operator}, can not be parsed into MongoDB Operator.`
    );
  }

  return operators[operator] || "";
}
