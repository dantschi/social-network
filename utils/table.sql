CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message TEXT,
    user_id INTEGER REFERENCES users(id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE privatechat (
    id SERIAL PRIMARY KEY,
    message TEXT,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallposts (
    id SERIAL PRIMARY KEY,
    message TEXT,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
