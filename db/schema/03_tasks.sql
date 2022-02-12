
DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  body VARCHAR(100) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  time_added TIMESTAMP NOT NULL DEFAULT NOW(),
  time_updated TIMESTAMP NOT NULL DEFAULT NOW(),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE OR REPLACE FUNCTION trigger_update_timestamp()
  RETURNS TRIGGER as $$
  BEGIN
    NEW.time_updated = NOW();
    RETURN NEW;
  END;
$$ language plpgsql;

CREATE TRIGGER update_timestamp
BEFORE UPDATE OF is_completed ON tasks
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_timestamp();
