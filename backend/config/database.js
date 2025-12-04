// Database Configuration and Connection Pool
// This file manages MySQL database connections using mysql2 library
// Author: StressBuster Team

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool for better performance
// Pool automatically manages connections and reuses them
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stress_buster',
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in pool
  queueLimit: 0, // Unlimited queueing
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Get promise-based wrapper for async/await support
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your database configuration in .env file');
    return false;
  }
};

// Execute a query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await promisePool.execute(query, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('Query execution error:', error.message);
    return { success: false, error: error.message };
  }
};

// Get a single row from query
const getOne = async (query, params = []) => {
  try {
    const [rows] = await promisePool.execute(query, params);
    return { success: true, data: rows[0] || null };
  } catch (error) {
    console.error('Query execution error:', error.message);
    return { success: false, error: error.message };
  }
};

// Insert data and return inserted ID
const insert = async (query, params = []) => {
  try {
    const [result] = await promisePool.execute(query, params);
    return { success: true, insertId: result.insertId, affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Insert error:', error.message);
    return { success: false, error: error.message };
  }
};

// Update data
const update = async (query, params = []) => {
  try {
    const [result] = await promisePool.execute(query, params);
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Update error:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete data
const deleteQuery = async (query, params = []) => {
  try {
    const [result] = await promisePool.execute(query, params);
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Delete error:', error.message);
    return { success: false, error: error.message };
  }
};

// Transaction support
const beginTransaction = async () => {
  const connection = await promisePool.getConnection();
  await connection.beginTransaction();
  return connection;
};

const commitTransaction = async (connection) => {
  await connection.commit();
  connection.release();
};

const rollbackTransaction = async (connection) => {
  await connection.rollback();
  connection.release();
};

module.exports = {
  pool,
  promisePool,
  testConnection,
  executeQuery,
  getOne,
  insert,
  update,
  deleteQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction
};
