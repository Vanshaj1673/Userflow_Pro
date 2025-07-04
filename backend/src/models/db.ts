import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'userflow_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// For SELECT queries with expected type
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// For INSERT, UPDATE, DELETE – return metadata like insertId
export async function execute(sql: string, params: any[] = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}
