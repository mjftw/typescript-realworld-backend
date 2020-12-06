CREATE TABLE users (
    id bigserial NOT NULL PRIMARY KEY,
    name varchar(50) NOT NULL,
    age int
);

INSERT INTO users (name, age)
VALUES
    ('Merlin', 27),
    ('John', 62),
    ('Marci', null);