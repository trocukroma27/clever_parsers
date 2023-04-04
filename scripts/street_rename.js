const mysql = require("mysql2/promise");
const db_config = require("../config/db");
const parseNewStreet = require("./streets_file_parser");

(async function() {
	const connection = await mysql.createConnection(db_config);

	const streets = await parseNewStreet();

	for (let i = 0; i < streets.length; i++) {
		const item = streets[i];

		const [data] = await connection.query(
			'SELECT * FROM `street` WHERE `name_ua` = ? AND `street_type_ua` = ? AND `id` IN (SELECT `street_id` FROM `district_has_street` WHERE `district_id` IN (SELECT id FROM `district` WHERE `name_ua` = ?));',
			[item.old_name_ua, item.type_ua, item.district]
		);
		if (data.length > 0) {
			await connection.query(
				'UPDATE `street` SET `name` = ?, `name_ua` = ?, `name_en` = ?, `old_name` = ?, `old_name_ua` = ? WHERE `id` = ?;',
				[item.new_name_ru, item.new_name_ua, item.new_name_en, data[0].name, item.old_name_ua, data[0].id]
			);
		}
	}

	connection.end();
})();