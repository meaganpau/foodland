'use server';

import { Pool } from 'pg';
import { ProduceItem, ProduceType, Season } from '@/types/produce';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getProduceItems(): Promise<ProduceItem[]> {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        opi.id,
        opi.name,
        pt.name as type,
        opi.is_year_round,
        opi.seasons,
        opi.availability,
        opi.all_seasons,
        opi.created_at,
        opi.updated_at,
        -- Get season names
        ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.id = ANY(opi.seasons)) as season_names,
        -- Get availability month names
        ARRAY_AGG(DISTINCT m.name ORDER BY m.name) FILTER (WHERE m.id = ANY(opi.availability)) as available_months
      FROM ontario_produce_items opi
      JOIN produce_types pt ON opi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(opi.seasons)
      LEFT JOIN months m ON m.id = ANY(opi.availability)
      GROUP BY opi.id, opi.name, pt.name, opi.is_year_round, opi.seasons, opi.availability, opi.all_seasons, opi.created_at, opi.updated_at
      ORDER BY opi.name
    `;
    
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getProduceItemsBySeason(seasonName: Season): Promise<ProduceItem[]> {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        opi.id,
        opi.name,
        pt.name as type,
        opi.is_year_round,
        opi.seasons,
        opi.availability,
        opi.all_seasons,
        opi.created_at,
        opi.updated_at,
        ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.id = ANY(opi.seasons)) as season_names,
        ARRAY_AGG(DISTINCT m.name ORDER BY m.name) FILTER (WHERE m.id = ANY(opi.availability)) as available_months
      FROM ontario_produce_items opi
      JOIN produce_types pt ON opi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(opi.seasons)
      LEFT JOIN months m ON m.id = ANY(opi.availability)
      WHERE EXISTS (
        SELECT 1 FROM seasons s2 
        WHERE s2.name = $1 AND s2.id = ANY(opi.seasons)
      )
      GROUP BY opi.id, opi.name, pt.name, opi.is_year_round, opi.seasons, opi.availability, opi.all_seasons, opi.created_at, opi.updated_at
      ORDER BY opi.name
    `;
    
    const result = await client.query(query, [seasonName]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getProduceItemsByType(type: ProduceType): Promise<ProduceItem[]> {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        opi.id,
        opi.name,
        pt.name as type,
        opi.is_year_round,
        opi.seasons,
        opi.availability,
        opi.all_seasons,
        opi.created_at,
        opi.updated_at,
        ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.id = ANY(opi.seasons)) as season_names,
        ARRAY_AGG(DISTINCT m.name ORDER BY m.name) FILTER (WHERE m.id = ANY(opi.availability)) as available_months
      FROM ontario_produce_items opi
      JOIN produce_types pt ON opi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(opi.seasons)
      LEFT JOIN months m ON m.id = ANY(opi.availability)
      WHERE pt.name = $1
      GROUP BY opi.id, opi.name, pt.name, opi.is_year_round, opi.seasons, opi.availability, opi.all_seasons, opi.created_at, opi.updated_at
      ORDER BY opi.name
    `;
    
    const result = await client.query(query, [type]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getProduceItemsByMonth(monthNumber: number): Promise<ProduceItem[]> {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        opi.id,
        opi.name,
        pt.name as type,
        opi.is_year_round,
        opi.seasons,
        opi.availability,
        opi.all_seasons,
        opi.created_at,
        opi.updated_at,
        ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.id = ANY(opi.seasons)) as season_names,
        ARRAY_AGG(DISTINCT m.name ORDER BY m.name) FILTER (WHERE m.id = ANY(opi.availability)) as available_months
      FROM ontario_produce_items opi
      JOIN produce_types pt ON opi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(opi.seasons)
      LEFT JOIN months m ON m.id = ANY(opi.availability)
      WHERE EXISTS (
        SELECT 1 FROM months m2 
        WHERE m2.month_number = $1 AND m2.id = ANY(opi.availability)
      )
      GROUP BY opi.id, opi.name, pt.name, opi.is_year_round, opi.seasons, opi.availability, opi.all_seasons, opi.created_at, opi.updated_at
      ORDER BY opi.name
    `;
    
    const result = await client.query(query, [monthNumber]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getYearRoundProduce(): Promise<ProduceItem[]> {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        opi.id,
        opi.name,
        pt.name as type,
        opi.is_year_round,
        opi.seasons,
        opi.availability,
        opi.all_seasons,
        opi.created_at,
        opi.updated_at,
        ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.id = ANY(opi.seasons)) as season_names,
        ARRAY_AGG(DISTINCT m.name ORDER BY m.name) FILTER (WHERE m.id = ANY(opi.availability)) as available_months
      FROM ontario_produce_items opi
      JOIN produce_types pt ON opi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(opi.seasons)
      LEFT JOIN months m ON m.id = ANY(opi.availability)
      WHERE opi.is_year_round = true
      GROUP BY opi.id, opi.name, pt.name, opi.is_year_round, opi.seasons, opi.availability, opi.all_seasons, opi.created_at, opi.updated_at
      ORDER BY opi.name
    `;
    
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
} 

export async function searchProduceItems(searchTerm: string): Promise<ProduceItem[]> {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        opi.id,
        opi.name,
        pt.name as type,
        opi.is_year_round,
        opi.seasons,
        opi.availability,
        opi.all_seasons,
        opi.created_at,
        opi.updated_at,
        ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.id = ANY(opi.seasons)) as season_names,
        ARRAY_AGG(DISTINCT m.name ORDER BY m.name) FILTER (WHERE m.id = ANY(opi.availability)) as available_months
      FROM ontario_produce_items opi
      JOIN produce_types pt ON opi.type_id = pt.id
      LEFT JOIN seasons s ON s.id = ANY(opi.seasons)
      LEFT JOIN months m ON m.id = ANY(opi.availability)
      WHERE LOWER(opi.name) LIKE LOWER($1)
      GROUP BY opi.id, opi.name, pt.name, opi.is_year_round, opi.seasons, opi.availability, opi.all_seasons, opi.created_at, opi.updated_at
      ORDER BY opi.name
      LIMIT 20
    `;
    
    const result = await client.query(query, [`%${searchTerm}%`]);
    return result.rows;
  } finally {
    client.release();
  }
} 