CREATE DATABASE db_cuidadores;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

ALTER TABLE users
    ADD COLUMN name VARCHAR(255),
    ADD COLUMN last_name VARCHAR(255),
    ADD COLUMN password VARCHAR(255),
    ADD COLUMN mail VARCHAR(255),
    ADD COLUMN type INTEGER,
    ADD COLUMN created_at DATE,
    ADD COLUMN modified_at DATE,
    ADD COLUMN enabled BOOLEAN,
    ADD COLUMN hourly_rate FLOAT
;

CREATE TABLE user_type(
    id INTEGER,
    caregiver_id INTEGER,
    customer_id INTEGER,
    observation VARCHAR(255),
    score FLOAT,
    created_at DATE,
    modified_at DATE
);

CREATE TABLE caregiver_score(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE contract(
    id SERIAL PRIMARY KEY,
    status VARCHAR(255),
    customer_id INTEGER,
    amount FLOAT,
    contract_start DATE,
    contract_end DATE,
    created_at DATE,
    modified_at DATE
);