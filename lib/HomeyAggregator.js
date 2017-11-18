const HomeyApi = require("./HomeyApi");
const Devices = require("./Devices");

class HomeyAggregator {

	constructor() {
		this.api = new HomeyApi(process.env.HOMEY_IP, process.env.BEARER_TOKEN);

		this.registerListeners();
		this.getDevices();

	}

	getDevices() {
		this.api.getDevices().then(devices => {
			devices.forEach((device) => {
				Devices.addDevice(device);
			});

			this.api.openSocket();
		});
	}

	listenToDevice(device) {
		this.api.listenToDevice(device);
	}

	registerListeners() {
		this.api.on("measure", (device, uuid, measure, value) => {
			console.log(device, uuid, measure, value);
		})
	}

}

module.exports = HomeyAggregator;