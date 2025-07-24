-- Schema Database Plateful

-- Tabella utenti
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella allergie
CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Tabella relazione utenti-allergie (molti a molti)
CREATE TABLE user_allergies (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    allergy_id INTEGER REFERENCES allergies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, allergy_id)
);

-- Tabella eventi
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    max_participants INTEGER,
    voting_deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella partecipazioni agli eventi
CREATE TABLE event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Tabella categorie di piatti
CREATE TABLE dish_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Tabella proposte di piatti
CREATE TABLE dish_proposals (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES dish_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    recipe TEXT,
    serving_size INTEGER,
    preparation_time INTEGER, -- in minuti
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella voti sui piatti
CREATE TABLE dish_votes (
    id SERIAL PRIMARY KEY,
    dish_proposal_id INTEGER REFERENCES dish_proposals(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(20) DEFAULT 'like' CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dish_proposal_id, user_id)
);

-- Tabella segnalazioni allergie sui piatti
CREATE TABLE dish_allergy_reports (
    id SERIAL PRIMARY KEY,
    dish_proposal_id INTEGER REFERENCES dish_proposals(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    allergy_id INTEGER REFERENCES allergies(id) ON DELETE CASCADE,
    ingredient_concern TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dish_proposal_id, user_id, allergy_id)
);

-- Tabella shopping list
CREATE TABLE shopping_lists (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella elementi shopping list
CREATE TABLE shopping_list_items (
    id SERIAL PRIMARY KEY,
    shopping_list_id INTEGER REFERENCES shopping_lists(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    category VARCHAR(100),
    is_purchased BOOLEAN DEFAULT FALSE,
    added_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella notifiche
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    related_event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--collegamento events e dish-categories 
CREATE TABLE event_categories (
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES dish_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);

-- Inserimento dati di base
INSERT INTO allergies (name, description) VALUES 
('Glutine', 'Intolleranza al glutine presente in grano, orzo, segale'),
('Lattosio', 'Intolleranza al lattosio presente nei latticini'),
('Noci', 'Allergia alla frutta secca'),
('Crostacei', 'Allergia ai crostacei'),
('Pesce', 'Allergia al pesce'),
('Uova', 'Allergia alle uova'),
('Soia', 'Allergia alla soia'),
('Sesamo', 'Allergia ai semi di sesamo');

INSERT INTO dish_categories (name, description) VALUES 
('Antipasti', 'Piatti per iniziare il pasto'),
('Primi Piatti', 'Pasta, riso, zuppe'),
('Secondi Piatti', 'Carne, pesce, piatti proteici'),
('Contorni', 'Verdure e accompagnamenti'),
('Dolci', 'Dessert e dolci'),
('Bevande', 'Drink e bevande');

INSERT INTO users (email, password_hash, first_name, last_name)
VALUES 
  ('alice@example.com', 'hashed1', 'Alice', 'Rossi'),
  ('marco@example.com', 'hashed2', 'Marco', 'Bianchi'),
  ('sara@example.com', 'hashed3', 'Sara', 'Verdi'),
  ('luca@example.com', 'hashed4', 'Luca', 'Neri');

-- Indici per migliorare le performance
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_dish_proposals_event_id ON dish_proposals(event_id);
CREATE INDEX idx_dish_proposals_category_id ON dish_proposals(category_id);
CREATE INDEX idx_dish_votes_dish_proposal_id ON dish_votes(dish_proposal_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

