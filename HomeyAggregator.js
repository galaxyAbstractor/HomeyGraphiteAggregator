const HomeyApi = require("./HomeyApi");

class HomeyAggregator {

	constructor() {

		this.api = new HomeyApi(process.env.HOMEY_IP, process.env.BEARER_TOKEN);

		this.registerListeners();

		this.getDevices();
	}

	getDevices() {
		this.api.getDevices().then(devices => {
			this.listenToDevices(devices);
		});
	}

	listenToDevices(devices) {
		this.api.listenToDevices(devices);
	}

	registerListeners() {
		this.api.on("measure", (name, uuid, measure, value) => {
			console.log(name, uuid, measure, value);
		})
	}

}

module.exports = HomeyAggregator;