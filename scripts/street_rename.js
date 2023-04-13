const mysql = require("mysql2/promise");
const db_config = require("../config/db");
const parseNewStreet = require("./streets_file_parser");
const fs = require('fs');
const combinations = require("../utils/combinations");

(async function() {
	const connection = await mysql.createConnection(db_config);

	const streets = await parseNewStreet();

    const notFindedStreets = [];
	for (let i = 0; i < streets.length; i++) {
		const item = streets[i];

        const old_name_ua_splitted = item.old_name_ua.split(" ");
        const old_name_ua_comb = combinations(old_name_ua_splitted);

        let finded = false;
        for (let i = 0; i < old_name_ua_comb.length; i++) {
            old_name_ua = old_name_ua_comb[i].join(" ");
            const [data] = await connection.query(
                'SELECT * FROM `street` WHERE `name_ua` = ? AND `street_type_ua` = ? AND `id` IN (SELECT `street_id` FROM `district_has_street` WHERE `district_id` IN (SELECT id FROM `district` WHERE `name_ua` = ?));',
                [old_name_ua, item.type_ua, item.district]
            );
            
            if (data.length > 0) {
                for (let j = 0; j < data.length; j++) {
                    await connection.query(
                        'UPDATE `street` SET `name` = ?, `name_ua` = ?, `name_en` = ?, `old_name` = ?, `old_name_ua` = ? WHERE `id` = ?;',
                        [item.new_name_ru, item.new_name_ua, item.new_name_en, data[j].name, item.old_name_ua, data[j].id]
                    );
                }
                finded = true;
            }
        }
        if (!finded) notFindedStreets.push(item);
	}

    fs.writeFileSync("notFindedStreets.json", JSON.stringify(notFindedStreets, null, 4), 'utf8');

	connection.end();
})();