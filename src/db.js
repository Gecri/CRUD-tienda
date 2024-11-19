import { createPool } from 'mysql2';
export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'cacas!tuc0angGay!',
    port: 3306,
    database: 'gestionUsuariosChuys',
    waitForConnections: true,
}).promise();
