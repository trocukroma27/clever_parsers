const mysql = require("mysql2/promise");
const db_config = require("./config/db");

(async function() {
	const connection = await mysql.createConnection(db_config);

	const [data] = await connection.query('SELECT * FROM `street` LIMIT 10');

	console.log(data);

	connection.end();
})();
