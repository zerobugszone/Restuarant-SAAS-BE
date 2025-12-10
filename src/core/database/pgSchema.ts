export const pgSchemaList = ['auth', 'restaurant', 'order', 'customer', 'setting'] as const;

export type PgSchema = (typeof pgSchemaList)[number];
