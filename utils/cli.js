const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	// debug: {
	// 	type: `boolean`,
	// 	default: false,
	// 	alias: `d`,
	// 	desc: `Print debug info`
	// },
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	// query flags
	download: {
		type: `boolean`,
		default: false,
		alias: 'd',
		desc: 'download the output'
	},
	repo: {
		type: 'string',
		default: 'X-lab2017/open-digger',
		alias: 'r',
		desc: 'direction of the repo',
	},
	// metric默认为all，查询所有指标；取具体的指标名如openrank可单独查询该指标；
	// 取index或者chaoss可查询对应类的所有指标
	metric: {
		type: 'string',
		default: 'all',
		alias: 'me',
		desc: 'metric for this query',
	},
	month: {
		type: 'string',
		default: 'all',
		alias: 'mo',
		desc: 'date month for this query',
	},
	// 按类型查找某类的所有指标
	type: {
		type: 'string',
		default: 'all',
		alias: 'ty',
		desc: 'type for this query',
	},
	// 按来源查找某类的所有指标
	from: {
		type: 'string',
		default: 'all',
		alias: 'f',
		desc: 'where is the data from',
	},
	// 下载内容的保存路径
	path: {
		type: 'string',
		default: 'output.txt',
		alias: 'p',
		desc: 'the path where downloaded contents are'
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `hq`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
