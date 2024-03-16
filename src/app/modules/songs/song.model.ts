const createSongSchema = `
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    duration INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    album_id INTEGER NOT NULL,
    CONSTRAINT album_id_fk FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE
);`;

export default createSongSchema;
