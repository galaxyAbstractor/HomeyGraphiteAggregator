const Table = require('cli-table2');
const HomeyApi = require("./HomeyApi");

class Commands {

	constructor() {
		this.api = new HomeyApi(process.env.HOMEY_IP, process.env.BEARER_TOKEN);
	}

	listDevices() {
		let table = new Table({head: ["id", "uuid", "name", "zone"]});

		this.api.getDevices().then((devices) => {
			let i = 0;

			devices.forEach((device) => {
				let caps = [];
				table.push([i++, device.id, device.name, device.zone.name]);
			});

			console.log(table.toString());
		});
	}

	listCapabilities(deviceIndex) {
		let Table = require('cli-table2');
		let table = new Table({head: ["Capability", "Type"]});

		this.api.getDevices().then((devices) => {
			let device = devices[Object.keys(devices)[deviceIndex]];
			for (let key in device.capabilities) {
				if (device.capabilities.hasOwnProperty(key)) {
					table.push([key, device.capabilities[key].type]);
				}
			}

			console.log(table.toString());
		});
	}
}

module.exports = Commands;