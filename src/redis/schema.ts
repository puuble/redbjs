export type ColumnType = "string" | "number" | "boolean" | "date";

export interface TableSchema {
  name: string;
  columns: Record<string, ColumnType>;
  primaryKey?: string;
}

export class SchemaRegistry {
  private static tables: Record<string, TableSchema> = {};

  static defineTable(schema: TableSchema) {
    if (this.tables[schema.name]) {
      throw new Error(`Table "${schema.name}" is already defined.`);
    }
    this.tables[schema.name] = schema;
  }

  static getTable(name: string): TableSchema {
    const schema = this.tables[name];
    if (!schema) throw new Error(`Table "${name}" is not defined.`);
    return schema;
  }

  static getAllTables(): Record<string, TableSchema> {
    return this.tables;
  }
}
