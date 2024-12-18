import {MultiRouter} from './src/MultiRouter.js';
import {readdir} from 'node:fs/promises';

// TOR deployments
// https://github.com/resolverworks/TheOffchainResolver.sol
// note: these should of been named better during development
// new scheme: {e/s/g}{version}
// only mainnet needs short urls to reduce storage costs
export const TOR_DEPLOY0 = 'e1'; // default deployment if unspecified (should always specify!)
export const TOR_DEPLOYS = {
	'e4': '0x7CE6Cf740075B5AF6b1681d67136B84431B43AbD', // Mainnet (v4)
	's4': '0x3c187BAb6dC2C94790d4dA5308672e6F799DcEC3', // Sepolia (v4)
	's5': '0x4E7BE27c494a57b4D84eb138F03bE9f43A03604E', // Sepolia

	// old
	 'g': '0x9b87849Aa21889343b6fB1E146f9F734ecFA9982', // Goerli
	'g2': '0x8e1af190fB76198b86C83c5EFe2Fb0ADC1cbD50F', // Goerli
	 's': '0x9Ec7f2ce83fcDF589487303fA9984942EF80Cb39', // Sepolia
	's2': '0xf93F7F8002BcfB285D44E9Ef82E711cCD0D502A2', // Sepolia (v3)
	'e0': '0x828ec5bDe537B8673AF98D77bCB275ae1CA26D1f', // Mainnet (alpha)
	'e1': '0x84c5AdB77dd9f362A1a3480009992d8d47325dc3', // Mainnet (v3)
	'd1': '0xa4407E257Aa158C737292ac95317a29b4C90729D', // DNS Mainnet (this was '' before)
	'ds': '0x179Be112b24Ad4cFC392eF8924DfA08C20Ad8583', // DNS Sepolia
	'eg': '0x2e513399b2c5337e82a0a71992cbd09b78170843', // ENS Goerli

	// tunnel
	'sot': '0xCa71342cB02714374e61e400f172FF003497B2c2', // Sepolia
};


export const ROUTERS = [];

function is_enabled(s) {
	return s && !/^(0+|false)$/i.test(s);
}

// load in demo routers
if (is_enabled(process.env.DEMO)) {
	ROUTERS.push((await import('./routers/fixed.js')).default);
	ROUTERS.push((await import('./routers/random.js')).default);
	ROUTERS.push((await import('./routers/simple.js')).default);
	ROUTERS.push((await import('./routers/flat.js')).default);
	ROUTERS.push((await import('./routers/tree.js')).default);
	ROUTERS.push((await import('./routers/airtable.js')).default);
	ROUTERS.push((await import('./routers/mirror.js')).default);
	ROUTERS.push((await import('./routers/coinbase.js')).default);
	ROUTERS.push((await import('./routers/wikipedia.js')).default);
	ROUTERS.push((await import('./routers/github.js')).default);
	ROUTERS.push((await import('./routers/reverse.js')).default);
	ROUTERS.push((await import('./routers/teamnick.js')).default);
	ROUTERS.push((await import('./routers/tunnel.js')).default);
	ROUTERS.push((await import('./routers/farcaster.js')).default);
	ROUTERS.push((await import('./routers/namespace.js')).default);
	ROUTERS.push((await import('./routers/unicode.js')).default);
	ROUTERS.push((await import('./routers/emoji.js')).default);
	ROUTERS.push((await import('./routers/xctens.js')).default);
	ROUTERS.push((await import('./routers/ensregs.js')).default);
	ROUTERS.push((await import('./routers/mydns.js')).default);
	ROUTERS.push((await import('./routers/cypher.js')).default);
	ROUTERS.push((await import("./routers/teamnick.js")).default);
	ROUTERS.push((await import("./routers/ens-votes.js")).default);
	ROUTERS.push(...(await import("./routers/3dns.js")).default);
}

// dynamically load any custom routers
// note: this directory is gitignored
const dir = new URL('./custom/', import.meta.url);
for (let name of await readdir(dir).catch(() => [])) {
	if (/.*js$/.test(name)) {
		ROUTERS.push((await import(new URL(name, dir))).default);
	}
}

// for debugging: exposes all routers as subdomains
// this makes it easy to serve everything from one endpoint
// eg. /multi [a.b].(simple).[c.d] => /simple [a.b.simple.c.d]
// in production: turn this off and use direct router endpoints
if (is_enabled(process.env.MULTI)) {
	ROUTERS.push(new MultiRouter('multi', ROUTERS));
}
