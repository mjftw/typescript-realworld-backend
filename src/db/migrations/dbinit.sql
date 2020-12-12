-- TODO: Add column constraints to force data format. E.g. email addresses

CREATE TABLE users (
    user_id bigint GENERATED ALWAYS AS IDENTITY,
    password_hash varchar(200) NOT NULL,
    password_salt varchar(100) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    username varchar(50) NOT NULL UNIQUE,
    bio text,
    image text,
    PRIMARY KEY(user_id)
);

CREATE UNIQUE INDEX email_idx ON users (email);
CREATE UNIQUE INDEX id_idx ON users (user_id);

CREATE TABLE articles (
    article_id bigint GENERATED ALWAYS AS IDENTITY,
    slug varchar(100) NOT NULL,
    title varchar(200) NOT NULL,
    description varchar(500),
    body text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    author_id bigint NOT NULL,
    PRIMARY KEY(article_id),
    FOREIGN KEY(author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id bigint GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    body text NOT NULL,
    author_id bigint NOT NULL,
    PRIMARY KEY(comment_id),
    FOREIGN KEY(author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id int GENERATED ALWAYS AS IDENTITY,
    title varchar(50) NOT NULL UNIQUE,
    PRIMARY KEY(tag_id)
);

CREATE TABLE users_followed_users (
    id bigint GENERATED ALWAYS AS IDENTITY,
    follower_user_id bigint NOT NULL,
    followed_user_id bigint NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(follower_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY(followed_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE users_favorited_articles (
    id bigint GENERATED ALWAYS AS IDENTITY,
    user_id bigserial NOT NULL,
    article_id bigserial NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY(article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE
);

CREATE TABLE articles_tags (
    id bigint GENERATED ALWAYS AS IDENTITY,
    article_id bigint NOT NULL,
    tag_id int NOT NULL,
    FOREIGN KEY(article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE,
    FOREIGN KEY(tag_id)
        REFERENCES tags(tag_id)
        ON DELETE CASCADE
);

CREATE TABLE articles_comments (
    id bigint GENERATED ALWAYS AS IDENTITY,
    article_id bigint NOT NULL,
    comment_id bigint NOT NULL,
    FOREIGN KEY(article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE,
    FOREIGN KEY(comment_id)
        REFERENCES comments(comment_id)
        ON DELETE CASCADE
);