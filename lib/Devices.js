const deviceConfig = require("../config/devices.json");

class Devices {
	constructor() {
		this.realtimeDevices = [];
		this.pollingDevices = [];

		this.populateDevices();
	}

	populateDevices() {
		deviceConfig.forEach((device) => {
			if(device.hasOwnProperty("type") && device.type === "realtime") {
				this.realtimeDevices.push(device);
			} else {
				this.pollingDevices.push(device);
			}
		});
	}

	getRealTimeDevices() {
		return this.realtimeDevices;
	}

	getPollingDevices() {
		return this.pollingDevices;
	}
}

module.exports = new Devices();