#!/usr/bin/env node
import {ElHydroClient, ElHydroApiError} from './index.js';
import {parseArgs} from 'node:util';
const help = `EL-HYDRO read-only CLI\nUsage: el-hydro <prices|travel|hours|company|services|health>\n       el-hydro search "wodomierz" [--limit 1-30]\n       el-hydro --help\nJSON output on stdout; errors on stderr. No credentials required.`;
try {
  const {values, positionals} = parseArgs({options: {help: {type: 'boolean', short: 'h'}, limit: {type: 'string'}}, allowPositionals: true, strict: true});
  const [command, ...args] = positionals;
  if (values.help || !command) console.log(help);
  else {
    const client = new ElHydroClient();
    let data;
    if (command === 'search') {
      if (values.limit !== undefined && !/^(?:[1-9]|[12][0-9]|30)$/.test(values.limit)) throw new Error('limit must be 1–30');
      data = await client.search(args.join(' '), {limit: values.limit === undefined ? 10 : Number(values.limit)});
    } else if (['prices','travel','hours','company','services','health'].includes(command) && args.length === 0 && values.limit === undefined) {
      data = await client[command]();
    } else throw new Error('Unknown command or unexpected arguments; use --help');
    console.log(JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error(JSON.stringify({code: error instanceof ElHydroApiError ? error.code : 'invalid_arguments', message: error.message, status: error.status ?? null, retryAfter: error.retryAfter ?? null}));
  process.exitCode = 1;
}
