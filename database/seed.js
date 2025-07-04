require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Read the produce data
const produceData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/parser/ontario/output.json'), 'utf8')
);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log('🌱 Starting database seeding...');

async function seedDatabase() {
  try {
    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schema = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf8');
    await runQuery(schema);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await runQuery('DELETE FROM ontario_produce_items');
    await runQuery('DELETE FROM produce_types');
    await runQuery('DELETE FROM months');
    await runQuery('DELETE FROM seasons');

    // Seed seasons
    console.log('🍂 Seeding seasons...');
    const springSeason = await insertSeason('spring', 'Spring', 1);
    const summerSeason = await insertSeason('summer', 'Summer', 2);
    const fallSeason = await insertSeason('fall', 'Fall', 3);
    const winterSeason = await insertSeason('winter', 'Winter', 4);
    
    // Create season mapping
    const seasonMap = {
      'spring': springSeason.id,
      'summer': summerSeason.id,
      'fall': fallSeason.id,
      'winter': winterSeason.id
    };

    // Seed months
    console.log('📅 Seeding months...');
    const months = await Promise.all([
      insertMonth('January', 1, 'Jan'),
      insertMonth('February', 2, 'Feb'),
      insertMonth('March', 3, 'Mar'),
      insertMonth('April', 4, 'Apr'),
      insertMonth('May', 5, 'May'),
      insertMonth('June', 6, 'Jun'),
      insertMonth('July', 7, 'Jul'),
      insertMonth('August', 8, 'Aug'),
      insertMonth('September', 9, 'Sep'),
      insertMonth('October', 10, 'Oct'),
      insertMonth('November', 11, 'Nov'),
      insertMonth('December', 12, 'Dec')
    ]);
    
    // Create month mapping
    const monthMap = {};
    months.forEach(month => {
      monthMap[month.name] = month.id;
    });

    // Seed produce types
    console.log('🥬 Seeding produce types...');
    const fruitsType = await insertProduceType('fruit', 'Fruits');
    const vegetablesType = await insertProduceType('vegetable', 'Vegetables');
    const typeMap = { Fruits: fruitsType.id, Vegetables: vegetablesType.id };

    // Seed produce items
    console.log('🍎 Seeding produce items...');
    for (const item of produceData) {
      // Convert season names to IDs
      const seasonIds = item.seasons.map(seasonName => seasonMap[seasonName]);
      const allSeasonIds = item.all_seasons.map(seasonName => seasonMap[seasonName]);
      
      // Convert month names to IDs
      const availabilityIds = item.availability.map(monthName => monthMap[monthName]);
      
      await insertProduceItem(
        item.name,
        typeMap[item.type],
        item.is_year_round,
        seasonIds,
        availabilityIds,
        allSeasonIds
      );
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded ${produceData.length} produce items`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await pool.end();
  }
}

// Helper functions
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function insertSeason(name, displayName, sortOrder) {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO seasons (name, display_name, sort_order) VALUES ($1, $2, $3) RETURNING id',
      [name, displayName, sortOrder],
      (err, result) => {
        if (err) reject(err);
        else resolve({ id: result.rows[0].id, name, displayName, sortOrder });
      }
    );
  });
}

function insertMonth(name, monthNumber, abbreviation) {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO months (name, month_number, abbreviation) VALUES ($1, $2, $3) RETURNING id',
      [name, monthNumber, abbreviation],
      (err, result) => {
        if (err) reject(err);
        else resolve({ id: result.rows[0].id, name, monthNumber, abbreviation });
      }
    );
  });
}

function insertProduceType(name, displayName) {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO produce_types (name, display_name) VALUES ($1, $2) RETURNING id',
      [name, displayName],
      (err, result) => {
        if (err) reject(err);
        else resolve({ id: result.rows[0].id, name, displayName });
      }
    );
  });
}

function insertProduceItem(name, typeId, isYearRound, seasons, availability, allSeasons) {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO ontario_produce_items (name, type_id, is_year_round, seasons, availability, all_seasons) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, typeId, isYearRound, seasons, availability, allSeasons],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Start seeding
seedDatabase(); 