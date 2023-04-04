const mysql = require("mysql2/promise");
const db_config = require("../config/db");

const street_type_translate = [
	{ "type": "ул.", "type_ua": "вул.", "type_en": "st." },
	{ "type": "переул.", "type_ua": "пров.", "type_en": "ln." },
	{ "type": "пл.", "type_ua": "пл.", "type_en": "sq." },
	{ "type": "спуск", "type_ua": "спуск", "type_en": "descent" },
	{ "type": "пр-т", "type_ua": "просп.", "type_en": "ave." },
	{ "type": "бул.", "type_ua": "б-р", "type_en": "blvd." },
	{ "type": "шоссе", "type_ua": "шосе", "type_en": "hwy" },
	{ "type": "дор.", "type_ua": "дор.", "type_en": "rd." },
	{ "type": "проезд", "type_ua": "проїзд", "type_en": "passage" },
	{ "type": "узв.", "type_ua": "узвіз", "type_en": "descent" },
	{ "type": "аллея", "type_ua": "алея", "type_en": "alley" },
	{ "type": "улица", "type_ua": "вул.", "type_en": "st." },
	{ "type": "наб.", "type_ua": "наб.", "type_en": "emb." },
	{ "type": "тупик", "type_ua": "тупик", "type_en": "blind alley" },
	{ "type": "пер.", "type_ua": "пров.", "type_en": "ln." },
	{ "type": "узвоз", "type_ua": "узвіз", "type_en": "descent" },
	{ "type": "дорога", "type_ua": "дорога", "type_en": "road" },
	{ "type": "проспект", "type_ua": "просп.", "type_en": "ave." },
];

(async function() {
	const connection = await mysql.createConnection(db_config);

	street_type_translate.forEach(async (item) => {
		await connection.query('UPDATE `street` SET street_type_ua = ?, street_type_en = ? WHERE street_type = ?;', [item.type_ua, item.type_en, item.type]);
	});

	connection.end();
}());