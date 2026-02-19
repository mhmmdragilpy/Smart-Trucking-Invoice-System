import { drizzle } from 'drizzle-orm/postgres-js';
import postgresLib from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = globalThis.postgres || postgresLib(connectionString, { prepare: false });

if (process.env.NODE_ENV !== 'production') {
    globalThis.postgres = client;
}

export const db = drizzle(client, { schema });

declare global {
    var postgres: ReturnType<typeof postgresLib> | undefined;
}
