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

  // Get all produce items with season and month names
  async getAllProduce() {
    const sql = `
      SELECT 
        pi.id,
        pi.name,
        pi.is_year_round,
        pt.name as type,
        pi.seasons,
        pi.availability,
        pi.all_seasons,
        ARRAY_AGG(DISTINCT s.name ORDER BY s.sort_order) as season_names,
        ARRAY_AGG(DISTINCT CASE WHEN s.id = ANY(pi.all_seasons) THEN s.name END) FILTER (WHERE s.id = ANY(pi.all_seasons)) as primary_season_names,
        ARRAY_AGG(DISTINCT m.name ORDER BY m.month_number) as availability_names
      FROM ontario_produce_items pi
      JOIN produce_types pt ON pi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(pi.seasons)
      LEFT JOIN months m ON m.id = ANY(pi.availability)
      GROUP BY pi.id, pi.name, pi.is_year_round, pt.name, pi.seasons, pi.availability, pi.all_seasons
      ORDER BY pt.name, pi.name
    `;
    return this.query(sql);
  }

  // Get produce available in a specific month
  async getProduceByMonth(monthName) {
    const sql = `
      SELECT pi.name, pt.name as type
      FROM ontario_produce_items pi
      JOIN produce_types pt ON pi.type_id = pt.id
      JOIN months m ON m.id = ANY(pi.availability)
      WHERE m.name = $1
      ORDER BY pt.name, pi.name
    `;
    return this.query(sql, [monthName]);
  }

  // Get produce available in a specific season
  async getProduceBySeason(seasonName) {
    const sql = `
      SELECT pi.name, pt.name as type
      FROM ontario_produce_items pi
      JOIN produce_types pt ON pi.type_id = pt.id
      JOIN seasons s ON s.id = ANY(pi.seasons)
      WHERE s.name = $1
      ORDER BY pt.name, pi.name
    `;
    return this.query(sql, [seasonName]);
  }

  // Get produce by type (fruits or vegetables)
  async getProduceByType(typeName) {
    const sql = `
      SELECT pi.name, pi.is_year_round
      FROM ontario_produce_items pi
      JOIN produce_types pt ON pi.type_id = pt.id
      WHERE pt.name = $1
      ORDER BY pi.name
    `;
    return this.query(sql, [typeName]);
  }

  // Get year-round produce
  async getYearRoundProduce() {
    const sql = `
      SELECT pi.name, pt.name as type
      FROM ontario_produce_items pi
      JOIN produce_types pt ON pi.type_id = pt.id
      WHERE pi.is_year_round = TRUE
      ORDER BY pt.name, pi.name
    `;
    return this.query(sql);
  }

  // Get produce available in current month
  async getCurrentMonthProduce() {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    return this.getProduceByMonth(currentMonth);
  }

  // Get produce available in current season
  async getCurrentSeasonProduce() {
    const month = new Date().getMonth();
    let season;
    
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'fall';
    else season = 'winter';
    
    return this.getProduceBySeason(season);
  }
}

module.exports = Database; 