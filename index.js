#!/usr/bin/env node

/**
 * hdx-t2-query
 * Query infos from OpenDigger
 *
 * @author hdX_13 <https://hdxl0v3.github.io>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const queryAll = require('./utils/queryAll');
const query = require('./utils/query');

const input = cli.input;
const flags = cli.flags;
const { clear } = flags;

(async () => {

	init({ clear });
	input.includes(`help`) && cli.showHelp(0);


	flags.repo && flags.metric && (flags.metric !== 'all')
	&& (await query(flags.repo, flags.metric, flags.month, flags.download, flags.path));

	flags.repo && flags.metric && (flags.metric === 'all')
	&& (await queryAll(flags.repo, flags.metric, flags.month, flags.type, flags.from, flags.download, flags.path));

	// debug && log(flags);

})();
