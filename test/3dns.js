import {get_ens_profile} from '../src/ThreeDNSRouter.js';

//const rec = await get_ens_profile('josh.box');
const rec = await get_ens_profile('test-13-06-2024-1517.box');

console.log(rec);

console.log(rec.toObject());

