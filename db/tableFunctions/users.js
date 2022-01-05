const util = require("util");
const { client } = require("../client");
const bcrypt = require("bcrypt");

const createUser = async ({ username, password, email }) => {
    try {
        const encryptPassword = await bcrypt.hash(password, 10);

        const { rows: [user] } = await client.query(`
            INSERT INTO users(username, password, email)
            VALUES($1, $2, $3)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, encryptPassword, email]);

        delete user.password;

        return user;
    } catch (error) {
        console.log(error);
    }
}

const getUserById = async (id) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE id=$1
        `, [id])

        if (!user) {
            return null
        }

        return user;
    } catch (error) {
        throw (error);
    }
}

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1
        `, [username])

        return user;
    } catch (error) {
        throw (error);
    }
}

const getUser = async ({ username, password }) => {
    try {
        const user = await getUserByUsername(username);
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch === true) {
            delete user.password;
            return user;
        }
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    getUser
}