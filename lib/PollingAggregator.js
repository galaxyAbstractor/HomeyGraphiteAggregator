const HomeyApi = require("./HomeyApi");
const graphite = require('graphite');
const devices = require("./Devices").getPollingDevices();
const request = require('request-promise');

class PollingAggregator {

	constructor() {
		this.graphiteClient = graphite.createClient(process.env.GRAPHITE);
		this.timers = [];
		this.registerTimers();
	}

	registerTimers() {
		devices.forEach((device) => {
			let interval = device.hasOwnProperty("poll_interval") ? device.poll_interval : 30000;

			let self = this;
			this.timers.push(setInterval(() => {
				self.poll(device.uuid, device.capability, device.metric);
			}, interval));
		});
	}

	poll(uuid, capability, metric) {
		let options = {
			'uri': process.env.HOMEY_IP + "/api/manager/devices/device/" + uuid,
			'auth': {
				'bearer': process.env.BEARER_TOKEN
			},
			'json': true,
		};

		request(options).then((res) => {
			let result = res.result;

			if(result.state.hasOwnProperty(capability)) {
				let metricObj = {};

				metricObj[metric] = result.state.capability;
				this.graphiteClient.write(metricObj, function (err) {

				});
			}


		}).catch(function (err) {
			console.error("There was an error polling: ", err)
		});
	}

}

module.exports = PollingAggregator;