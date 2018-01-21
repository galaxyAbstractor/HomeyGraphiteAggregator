const request = require('request-promise');
const WebSocket = require("ws");
const EventEmitter = require('events');
const devices = require("./Devices").getRealTimeDevices();


class HomeyApi extends EventEmitter {

	constructor(uri, token) {
		super();

		this.uri = uri;
		this.token =  token;

		this.socketUri = uri + "/socket.io/?EIO=3&transport=websocket&token=" + this.token;
	}

	getDevices() {
		return new Promise((resolve, reject) => {
			let options = {
				'uri': this.uri + "/api/manager/devices/device/",
				'auth': {
					'bearer': this.token
				},
				'json': true,
			};

			request(options).then((res) => {
				let result = res.result;
				let devices = [];

				for (let key in result) {
					if (result.hasOwnProperty(key)) {
						devices.push(result[key]);
					}
				}

				resolve(devices);
			}).catch(function (err) {
				reject(err);
			});
		});
	}

	openSocket() {
		this.ws = new WebSocket(this.socketUri);

		this.ws.on("open",  () => {
			devices.forEach((device) => {
				this.ws.send("40/realtime/device/" + device.uuid + "/")
			});
		});

		this.ws.on('close', (code, reason) => {
			console.log('disconnected', code, reason);
			this.openSocket();
		});

		this.ws.on('error', (err) => {
			console.log(err);
		});

		let replyRegexp = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/,\["(.+)",(.+)]/;

		this.ws.on('message', (data) => {
			let m;
			if ((m = replyRegexp.exec(data)) !== null) {
				let device = devices.find(function (device) {
					return device.uuid === m[1];
				});

				this.emit("measure", device, m[1], m[2], m[3]);
			}
		});

		if (this.pingInterval) clearInterval(this.pingInterval);

		this.pingInterval = setInterval(() => {
			this.ws.send("2");
		}, 20000);
	}
}

module.exports = HomeyApi;