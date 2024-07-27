import {ThreeDNSRouter} from '../src/ThreeDNSRouter.js';
export default [
	new ThreeDNSRouter({slug: '3dns'}),
	new ThreeDNSRouter({slug: '3dns-testnet', testnet: true}),
];
