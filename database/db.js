const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async connect() {
    // Test the connection
    const client = await this.pool.connect();
    client.release();
  }

  async disconnect() {
    await this.pool.end();
  }

  async query(sql, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async run(sql, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return { 
        id: result.rows[0]?.id, 
        changes: result.rowCount 
      };
    } finally {
      client.release();
    }
  }
}

module.exports = Database; 