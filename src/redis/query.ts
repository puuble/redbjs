export type QueryFilter =
  | {
      field: string;
      op: "eq" | "ne" | "gt" | "lt" | "in" | "contains";
      value: any;
    }
  | Record<string, any>;

export class QueryUtils {
  static match(record: Record<string, any>, filter: QueryFilter): boolean {
    if (!filter) return true;

    if (!Array.isArray(filter) && !("op" in filter)) {
      // Simple equality object: { email: "x@y.com" }
      return Object.entries(filter).every(([k, v]) => record[k] === v);
    }

    const { field, op, value } = filter as any;
    const target = record[field];

    switch (op) {
      case "eq":
        return target === value;
      case "ne":
        return target !== value;
      case "gt":
        return parseFloat(target) > parseFloat(value);
      case "lt":
        return parseFloat(target) < parseFloat(value);
      case "in":
        return Array.isArray(value) && value.includes(target);
      case "contains":
        return typeof target === "string" && target.includes(value);
      default:
        return false;
    }
  }
}
