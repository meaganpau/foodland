-- Ontario Produce Database Schema (Simplified)
-- PostgreSQL compatible schema for Vercel Neon

-- Drop all tables if they exist (for clean seeding)
DROP TABLE IF EXISTS ontario_produce_items CASCADE;
DROP TABLE IF EXISTS produce_types CASCADE;
DROP TABLE IF EXISTS months CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;

-- Seasons and months lookup tables (optional, for reference)
CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE CHECK (name IN ('spring', 'summer', 'fall', 'winter')),
    display_name VARCHAR(10) NOT NULL,
    sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS months (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE,
    month_number INTEGER NOT NULL UNIQUE CHECK (month_number BETWEEN 1 AND 12),
    abbreviation VARCHAR(3) NOT NULL
);

-- Produce types lookup table
CREATE TABLE IF NOT EXISTS produce_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE CHECK (name IN ('fruit', 'vegetable')),
    display_name VARCHAR(20) NOT NULL
);

-- Main produce items table (now with array columns)
CREATE TABLE IF NOT EXISTS ontario_produce_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type_id INTEGER NOT NULL REFERENCES produce_types(id),
    is_year_round BOOLEAN NOT NULL DEFAULT FALSE,
    seasons INTEGER[] NOT NULL, -- References seasons.id
    availability INTEGER[] NOT NULL, -- References months.id
    all_seasons INTEGER[] NOT NULL, -- References seasons.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ontario_produce_items_type ON ontario_produce_items(type_id);
CREATE INDEX IF NOT EXISTS idx_ontario_produce_items_year_round ON ontario_produce_items(is_year_round); 