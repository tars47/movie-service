CREATE  DATABASE moviedb;

\c moviedb

CREATE TABLE users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(user_id)
);

CREATE TABLE movies (
	user_id INTEGER NOT NULL,
    movie_name VARCHAR(255) NOT NULL,
    rating NUMERIC(3,1) NOT NULL CHECK (rating >=0.0 AND rating <=10.0),
    cast_list VARCHAR(255)[] NOT NULL,
    genre VARCHAR(255) NOT NULL CHECK (genre IN ( 'Action', 'Comedy', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Musical', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'Western')),
    release_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
	UNIQUE (movie_name, user_id, release_date),
	CONSTRAINT fk_users  
    FOREIGN KEY(user_id)   
    REFERENCES users(user_id)  
    ON DELETE CASCADE  
);
