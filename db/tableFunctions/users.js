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

module.exports = {
    createUser
}