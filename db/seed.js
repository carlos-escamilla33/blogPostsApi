const { client } = require("./client");

const dropTables = async () => {
    try {
        console.log("Starting to drop tables");

        await client.query(`
            DROP TABLE IF EXISTS post_comments;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
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

const createInitalUsers = async () => {
    try {
        console.log("Creating Initial Posts")
        const createUsers = [
            {
                username: "carlos12",
                password: "miamiheat06",
                email: "MiamiHeatFan06@gmail.com"
            },
            {
                username: "chad11",
                password: "goldenStateWarriors15",
                email: "WarriorsFan15@gmail.com"
            },
            {
                username: "rico10",
                password: "lakers4ever",
                email: "LakersFan20@gmail.com"
            },
        ]
        const users = await Promise.all(createUsers.map(createUser));

        console.log(users)
    } catch (error) {
        console.log(error)
    }
}

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitalUsers();
    } catch (error) {
        console.log(error)
    }
}

rebuildDB()
    .catch(console.error)
    .finally(() => client.end());