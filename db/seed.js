const {client} = require("./index");

const dropTables = () => {
    try {
        console.log("Starting to drop tables");

        await client.query(`
            DROP TABLE IF EXITS post_comments
            DROP TABLE IF EXITS posts
            DROP TABLE IF EXITS users
        `)
    }
    catch (error) {
        console.log("Error while dropping tables!");
        throw error;
    }
}

const createTables = async () => {
    try {
        console.log("Starting to create tables...")
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
            );

            CREATE TABLE posts(
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id),
                title VARCHAR(255) UNIQUE NOT NULL,
                description VARCHAR(255) UNIQUE NOT NULL,
                published DATE DEFAULT CURRENT_TIMESTAMP NOT NULL
            );

            CREATE TABLE post_comments (
                id SERIAL PRIMARY KEY,
                "postId" INTEGER REFERENCES posts(id),
                content TEXT NOT NULL
            )
        `)
    }
    catch (error) {
        console.log("Error creating tables!")
    }
}