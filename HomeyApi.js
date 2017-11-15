const request = require('request-promise');
const WebSocket = require("ws");
const EventEmitter = require('events');

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
				let devices = {};

				for (let key in result) {
					devices[result[key].id] = result[key].name;
				}

				this.devices = devices;
				resolve(devices);
			}).catch(function (err) {
				reject(err);
			});
		});
	}

	listenToDevices(devices) {
		let replyRegexp = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/,\["(.+)",(.+)]/;
		this.ws = new WebSocket(this.socketUri, [],
				{
					'headers': {
						'Cookie': this.cookieJar.getCookieString(this.uri)
					}
				});

		this.ws.on('open', () => {
			for(let device in devices) {
				this.ws.send("40/realtime/device/" + device + "/")
			}
		});

		this.ws.on('close', (code, reason) => {
			console.log('disconnected', code, reason);
		});

		this.ws.on('error', (err) => {
			console.log(err);
		});

		this.ws.on('message', (data) => {
			let m;
			if ((m = replyRegexp.exec(data)) !== null) {
				let name = "";

				if(this.devices.hasOwnProperty(m[1])) {
					name = this.devices[m[1]];
				}

				this.emit("measure", name, m[1], m[2], m[3]);
			}
		});

		if(this.pingInterval) clearInterval(this.pingInterval);

		this.pingInterval = setInterval( () => {
			this.ws.send("2");
		}, 20000);
	}

}

module.exports = HomeyApi;