import {Record} from '@resolverworks/enson';
import {ethers} from 'ethers';
import {SmartCache} from './SmartCache.js';

export class ThreeDNSRouter {	
	constructor({slug, testnet}) {
		this.slug = slug;
		this.testnet = testnet;
		this.cache = new SmartCache();
	}
	async resolve(name, context, history) {
		//history.show = [asciiize(name)];
		if (!name) {
			return Record.from({
				avatar: 'https://app.3dns.box/favicon/android-chrome-192x192.png',
				description: `Hello from 3DNS ${this.testnet ? 'Testnet' : 'Mainnet'} Offchain Resolver!`
			});	
		}
		return this.cache.get(name, name => get_ens_profile(name, this.testnet));
	}
}

export function get_api_url(testnet) {
	if (testnet) {
		return 'https://api.dev.3dns.xyz';
	} else {
		return 'https://api.3dns.xyz';
	}
}

export async function get_ens_profile(name, testnet) {
	const node = ethers.namehash(name);
	const url = `${get_api_url(testnet)}/api/v1/core_backend_service/domain/ens/get_ens_profile/${node.slice(2)}`;
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`http ${res.status}`);
		const json = await res.json();
		const record = new Record();
		record.__owner = json.registrant;
		if (json.primaryAddress !== ethers.ZeroAddress) {
			record.set(60, json.primaryAddress);
		}
		record.setName(json.name.slice(0, -1)); // drop trailing "."
		Object.entries(json.text ?? {}).forEach(([k, v]) => record.set(k, v));
		Object.entries(json.addresses ?? {}).forEach(([k, v]) => record.set(`$${k}`, v));
		return record;
	} catch (err) {
		return new Error(`unable to resolve: ${name}: ${url}`, {cause: err});
	}
}
