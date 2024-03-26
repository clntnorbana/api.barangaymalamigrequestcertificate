import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
  })
  .promise();

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to database");
    connection.release();
  } catch (error: any) {
    console.error(`Failed to connect to database`, error.code, error.message);
  }
};

export { pool, testConnection };
