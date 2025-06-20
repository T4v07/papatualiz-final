// utils/db.js
import mysql from "mysql2/promise";

// Lê o certificado SSL diretamente da variável de ambiente
const sslCa = process.env.DB_SSL_CA || null;

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslCa
    ? {
        ca: sslCa,
        rejectUnauthorized: false,
      }
    : { rejectUnauthorized: false },
});
