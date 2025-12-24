CREATE DATABASE card_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Polish_Poland.1250'
    LC_CTYPE = 'Polish_Poland.1250'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;E

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT,
  rarity VARCHAR(20),
  icon TEXT NOT NULL,
  cards_count INTEGER NOT NULL CHECK (cards_count > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_packs (
  user_id INTEGER NOT NULL,
  pack_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  PRIMARY KEY (user_id, pack_id),
  CONSTRAINT fk_users_packs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_users_packs_pack
    FOREIGN KEY (pack_id) REFERENCES packs(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  value INTEGER NOT NULL CHECK (value > 0),
  description TEXT,
  rarity VARCHAR(30) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name) 
);

CREATE TABLE packs_cards (
  pack_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL,
  drop_weight INTEGER NOT NULL CHECK (drop_weight > 0), 
  PRIMARY KEY (pack_id, card_id),
  CONSTRAINT fk_packs_cards_pack
    FOREIGN KEY (pack_id) REFERENCES packs(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_packs_cards_card
    FOREIGN KEY (card_id) REFERENCES cards(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users_cards (
  user_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  PRIMARY KEY (user_id, card_id),
  CONSTRAINT fk_users_cards_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_users_cards_card
    FOREIGN KEY (card_id) REFERENCES cards(id)
    ON DELETE CASCADE
);