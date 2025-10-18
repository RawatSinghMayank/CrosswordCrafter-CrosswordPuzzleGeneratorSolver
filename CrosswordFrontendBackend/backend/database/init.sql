-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS word_clue_db;

-- Use the database
USE word_clue_db;

-- Create crossword_grid table
CREATE TABLE IF NOT EXISTS crossword_grid (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grid LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_created_at ON crossword_grid(created_at);
