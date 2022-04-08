const Pool = require("pg-pool");

const pool = new Pool({
    database: "fulfil",
    user: "postgres",
    password: "newPassword",
    host: "localhost",
    port: 5432,
});

let id = "5";

async function init() {
    try {
        const client = await pool.connect();

        // await client.query(
        //     `INSERT INTO users (full_name, username) VALUES ('Asadbek', 'zoirovasadbek');`
        // );

        let users = await client.query(
            `SELECT * from users WHERE user_id = $1 AND username = $2`,
            [id, "username"]
        );
        users = users.rows;
        console.log(users);
    } catch (e) {
        console.log(e);
    }
}

init();
// postgres://postgres:newPassword@localhost:5432/fulfil