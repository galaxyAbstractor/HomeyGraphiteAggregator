const HomeyApi = require("./HomeyApi");

class HomeyAggregator {

	constructor() {
		this.api = new HomeyApi(process.env.HOMEY_IP, process.env.BEARER_TOKEN);

		this.registerListeners();
		this.api.openSocket();
	}

	registerListeners() {
		this.api.on("measure", (device, uuid, measure, value) => {
			console.log(device, uuid, measure, value);
		})
	}

}

module.exports = HomeyAggregator;