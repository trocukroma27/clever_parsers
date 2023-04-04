const https = require('https');
const fs = require('fs');

const sheetId = '1-HVDgNLT5-a08m3G2GmmsrUqKRWHs1YSgjiVLFZwffE';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Sheet1';
const query = encodeURIComponent('SELECT *');
const url = `${base}tq=${query}&sheet=${sheetName}`;

function parse() {
	return new Promise((resolve) => {

		https.get(url, (res) => {
			let data = [];
			res.on('data', chunk => data.push(chunk));
			
			res.on('end', () => {
				data = Buffer.concat(data).toString();
				const json = JSON.parse(data.substr(47).slice(0, -2));
				const rows = json.table.rows.slice(1);
				const mappedRows = rows.map((row) => {
					if (row.c[0].v) {
						return { 
							old_name_ua: row.c[0].v, 
							type_ua: row.c[1].v, 
							new_name_ua: row.c[2].v, 
							new_name_ru: row.c[3].v,
							new_name_en: row.c[4].v, 
							type_en: row.c[5].v,
							district: row.c[6].v
						};
					}
				});
				resolve(mappedRows);
			});
		});
	});
}

module.exports = parse;