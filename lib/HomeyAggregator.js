const HomeyApi = require("./HomeyApi");
const graphite = require('graphite');
class HomeyAggregator {

	constructor() {
		this.api = new HomeyApi(process.env.HOMEY_IP, process.env.BEARER_TOKEN);
		this.graphiteClient = graphite.createClient(process.env.GRAPHITE);
		this.registerListeners();
		this.api.openSocket();
	}

	registerListeners() {
		this.api.on("measure", (device, uuid, measure, value) => {
			let metric = {};

			metric[device.metric] = value;
			this.graphiteClient.write(metric, function (err) {

			});
		})
	}

}

module.exports = HomeyAggregator;