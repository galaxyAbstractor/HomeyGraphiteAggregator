require('dotenv').config();
const HomeyAggregator = require("./lib/HomeyAggregator");
const Commands = require("./lib/Commands");
const program = require('commander');

const cmds = new Commands();

program
		.version('0.1.0')
		.option('-l, --list', 'List devices')
		.option('-c, --capabilities <n>', 'List capabilities of device', parseInt)
		.parse(process.argv);

if (program.list) {
	cmds.listDevices();
} else if (program.capabilities) {
	cmds.listCapabilities(program.capabilities);
} else {
	let h = new HomeyAggregator();
}

