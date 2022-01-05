const { client } = require("../client");

const createPost = async ({creatorId, title, description, published}) => {
    try {
        const {rows: [post]} = await client.query(`
            INSERT INTO posts("creatorId", title, description, published)\
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, title, description, published]);

        return post;
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    createPost
}