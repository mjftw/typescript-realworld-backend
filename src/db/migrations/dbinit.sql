-- TODO: Add column constraints to force data format. E.g. email addresses

CREATE TABLE users (
    user_id bigserial PRIMARY KEY,
    password_hash varchar(200) NOT NULL,
    password_salt varchar(100) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    username varchar(50) NOT NULL UNIQUE,
    bio text,
    image text
);

CREATE UNIQUE INDEX email_idx ON users (email);

CREATE TABLE articles (
    article_id bigserial PRIMARY KEY,
    title varchar(200) NOT NULL,
    description varchar(500) NOT NULL,
    slug varchar(200) UNIQUE,
    body text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    author_id bigint NOT NULL,
    FOREIGN KEY(author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX slug_idx ON articles(slug);

CREATE TABLE comments (
    comment_id bigserial PRIMARY KEY,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    body text NOT NULL,
    author_id bigint NOT NULL,
    FOREIGN KEY(author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE users_followed_users (
    follower_user_id bigint,
    followed_user_id bigint,
    PRIMARY KEY(follower_user_id, followed_user_id),
    FOREIGN KEY(follower_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY(followed_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE users_favorited_articles (
    user_id bigint,
    article_id bigint,
    PRIMARY KEY(user_id, article_id),
    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY(article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE
);

CREATE TABLE article_tags (
    article_id bigint,
    tag varchar(50),
    PRIMARY KEY (article_id, tag),
    FOREIGN KEY(article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE
);

CREATE TABLE articles_comments (
    article_id bigint,
    comment_id bigint,
    PRIMARY KEY(article_id, comment_id),
    FOREIGN KEY(article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE,
    FOREIGN KEY(comment_id)
        REFERENCES comments(comment_id)
        ON DELETE CASCADE
);