const request = require('request-promise');
const WebSocket = require("ws");
const EventEmitter = require('events');
const Devices = require("./Devices");

class HomeyApi extends EventEmitter {

	constructor(uri, token) {
		super();

		this.cookieJar = request.jar();
		this.uri = uri;
		this.token = token;

		this.socketUri = uri + "/socket.io/?EIO=3&transport=websocket";

	}

	getDevices() {
		return new Promise((resolve, reject) => {
			let options = {
				'uri': this.uri + "/api/manager/devices/device/",
				'auth': {
					'bearer': this.token
				},
				'json': true,
				"jar": this.cookieJar
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
		let devices = Devices.getDevices();
		this.ws = new WebSocket(this.socketUri, [],
				{
					'headers': {
						'Cookie': this.cookieJar.getCookieString(this.uri)
					}
				});

		this.ws.on("open",  () => {
			for(let key in devices) {
				this.ws.send("40/realtime/device/" + key + "/")
			}
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
				let device;

				if (devices.hasOwnProperty(m[1])) {
					device = devices[m[1]];
				}

				this.emit("measure", device, m[1], m[2], m[3]);
			}
		});

		if (this.pingInterval) clearInterval(this.pingInterval);

		this.pingInterval = setInterval(() => {
			this.ws.send("2");
		}, 20000);


	}

	listenToDevice(device) {
		/*if (!this.ws) {
			this.openSocket();
		} else {
			this.ws.send("40/realtime/device/" + device.id + "/")
		}*/
	}

}

module.exports = HomeyApi;