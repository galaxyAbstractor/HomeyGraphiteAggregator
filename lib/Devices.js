class Devices {

	constructor() {
		this.devices = {};
	}

	addDevice(device) {
		if(!this.devices.hasOwnProperty(device.id)) {
			this.devices[device.id] = {
				name: device.name,
				zone: device.zone.name,
				capabilities: device.capabilitiesArray
			};

			console.log("Device " + device.name + " added");
		}
	}

	getDevices() {
		return this.devices;
	}

}

module.exports = new Devices();