require('dotenv').config();

const program = require('commander');

program
		.version('0.1.0')
		.option('-l, --list', 'List devices')
		.option('-c, --capabilities <n>', 'List capabilities of device', parseInt)
		.parse(process.argv);

const HomeyApi = require("./lib/HomeyApi");
const api = new HomeyApi(process.env.HOMEY_IP, process.env.BEARER_TOKEN);

if (program.list) {
	let Table = require('cli-table2');
	let table = new Table({head: ["id", "name", "zone"]});


	api.getDevices().then((devices) => {
		let i = 0;

		devices.forEach((device) => {
			let caps = [];

			table.push([i++, device.name, device.zone.name]);
		});

		console.log(table.toString());

	});

} else if (program.capabilities) {
	let Table = require('cli-table2');
	let table = new Table({head: ["Capability", "Type"]});

	api.getDevices().then((devices) => {
		let device = devices[Object.keys(devices)[program.capabilities]];
		for (let key in device.capabilities) {
			if (device.capabilities.hasOwnProperty(key)) {
				table.push([key, device.capabilities[key].type]);
			}
		}
		console.log(table.toString());

	});

} else {

}

