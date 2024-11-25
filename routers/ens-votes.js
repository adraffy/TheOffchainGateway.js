import {Record} from '@resolverworks/enson';
import {SmartCache} from '../src/SmartCache.js';
import {ethers} from 'ethers';

const cache = new SmartCache({ms: 60000});
const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth', 1, {staticNetwork: true});

const ENS_ERC20 = new ethers.Contract('0xc18360217d8f7ab5e7c516566761ea12ce7f9d72', [
	`function getVotes(address) view returns (uint256)`,
], provider);

export default {
	slug: 'ens-votes',
	async resolve(name) {
		if (!name) return;
		const res = await cache.get(name, get_votes);
		if (!res) return;
		const rec = new Record();
		rec.setName(name);
		rec.setAddress(res.address);
		rec.setText('description', `${res.votes} ENS votes`);
		rec.setText('url', `https://etherscan.io/token/0xc18360217d8f7ab5e7c516566761ea12ce7f9d72#readContract#F10`);
		return rec;
	}
};

async function get_votes(name) {
	let address;
	if (/^0x[0-9a-f]{40}$/i.test(name)) {
		address = name.toLowerCase();
	} else {
		address = await provider.resolveName(name);
		if (!address) return;
	}
	const votes = await ENS_ERC20.getVotes(address);
	return { address, votes };
}
