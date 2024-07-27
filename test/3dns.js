import {get_ens_profile} from '../src/ThreeDNSRouter.js';

const rec = await get_ens_profile('josh.box');

console.log(rec);

console.log(rec.toObject());

