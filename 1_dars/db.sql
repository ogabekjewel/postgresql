CREATE DATABASE ogabek; // database ochadi
\! cls    // terminalni tozalash
\c <name> //databasega kirish
\dt       //databasedagi tablelarni ko'rish

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(32),
    username VARCHAR(32) 
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32)
);

CREATE TABLE my_table (
    id SERIAL PRIMARY KEY,
    hi BIGINT,
    lo BIGINT
);

-- CRUD

-- CREATE
INSERT INTO users VALUES (1, 'Asadbek', 'asadbek');
INSERT INTO users (full_name, username) VALUES ('ISM', 'username')
INSERT INTO my_table (hi, lo) VALUES (30, 10);
INSERT INTO users (full_name, username) VALUES ('Asadbek', 'asadbek'), 
                        ('Asadbek', 'asadbek');

-- READ
SELECT * FROM users;
SELECT * FROM users WHERE user_id = 1 AND full_name = 'Asadbek';
SELECT id, hi, lo, (hi + lo) / 2 AS deg FROM my_table WHERE id = 1;

-- UPDATE
UPDATE users SET full_name = 'Zoirov' WHERE user_id = 1 RETURNING *;

-- DELETE
DELETE FROM users WHERE user_id = 3 RETURNING full_name;