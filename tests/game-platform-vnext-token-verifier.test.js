import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import { createTokenVerifier } from '../services/game-platform-vnext/tokenVerifier.mjs';
const pair = await generateKeyPair('ES256');
const other = await generateKeyPair('ES256');
const publicKey = { ...await exportJWK(pair.publicKey), kid:'offline-key', use:'sig', alg:'ES256' };
const claims = { iss:'https://jwt-fixture.invalid', aud:'offline-vnext', sub:'11111111-1111-4111-8111-111111111111', session_id:'22222222-2222-4222-8222-222222222222', exp:2000, nbf:900 };
const config = (clock=()=>1000000) => ({issuer:claims.iss,audience:claims.aud,algorithms:['ES256'],jwks:{keys:[publicKey]},clock});
const sign = (payload=claims,key=pair.privateKey,header={alg:'ES256',typ:'JWT',kid:'offline-key'}) => new SignJWT(payload).setProtectedHeader(header).sign(key);
const reject = (v,t,options) => assert.rejects(v.verify(t,options), e=>e.message===e.code && e.code.startsWith('TOKEN_'));
test('actual ES256 signature derives minimal immutable token facts only',async()=>{
 const v=createTokenVerifier(config()),result=await v.verify(await sign());
 assert.equal(result.kind,'VERIFIED_TOKEN_CLAIMS');assert.equal(result.subject,claims.sub);assert.equal(result.sessionId,claims.session_id);
 assert.equal(Object.isFrozen(result),true);assert.equal('allowed' in result,false);assert.equal('token' in result,false);
});
test('actual wrong key and payload/signature tampering are rejected',async()=>{
 const v=createTokenVerifier(config());await reject(v,await sign(claims,other.privateKey));
 const token=await sign(),parts=token.split('.');parts[1]=Buffer.from(JSON.stringify({...claims,exp:3000})).toString('base64url');await reject(v,parts.join('.'));
 parts[2]=Buffer.alloc(64).toString('base64url');await reject(v,parts.join('.'));
});
for (const [name,patch] of Object.entries({issuer:{iss:'wrong'},audience:{aud:'wrong'},expired:{exp:1000},future:{nbf:1001},sub:{sub:'client'},sid:{session_id:3},expType:{exp:'2000'},expFraction:{exp:2000.5},nbfFraction:{nbf:900.5}})) {
 test(`real signature rejects invalid ${name}`,async()=>reject(createTokenVerifier(config()),await sign({...claims,...patch})));
}
for(const field of ['sub','session_id','exp'])test(`required ${field} cannot be omitted`,async()=>{const c={...claims};delete c[field];await reject(createTokenVerifier(config()),await sign(c));});
test('untrusted key URL, embedded key, unknown kid and alg confusion cannot select authority',async()=>{
 const v=createTokenVerifier(config());
 for(const patch of [{jku:'https://untrusted.invalid'},{x5u:'https://untrusted.invalid'},{jwk:publicKey},{kid:'unknown'}])await reject(v,await sign(claims,pair.privateKey,{alg:'ES256',typ:'JWT',kid:'offline-key',...patch}));
 const hs=await new SignJWT(claims).setProtectedHeader({alg:'HS256',typ:'JWT',kid:'offline-key'}).sign(new Uint8Array(32));await reject(v,hs);
 await reject(v,Buffer.from('{"alg":"none"}').toString('base64url')+'.e30.');
});
test('malformed input and fabricated claims objects cannot enter verification',async()=>{
 for(const t of [undefined,{},claims,'a.b.c','a.b','', 'a'.repeat(17000)])await reject(createTokenVerifier(config()),t);
});
test('absent configuration, private key input and unsupported algorithm fail closed',()=>{
 for(const c of [undefined,{...config(),issuer:''},{...config(),clock:undefined},{...config(),algorithms:['HS256']},{...config(),jwks:{keys:[]}},{...config(),jwks:{keys:[{...publicKey,d:'private'}]}}]) assert.throws(()=>createTokenVerifier(c));
});
test('signed token expires during actual crypto await and cannot escape as success',async()=>{
 let calls=0;const v=createTokenVerifier(config(()=>++calls===1?1000000:2000000));await reject(v,await sign());assert.equal(calls,2);
});
test('context closes during actual crypto await',async()=>{
 const c=new AbortController();const token=await sign();const pending=createTokenVerifier(config()).verify(token,{signal:c.signal});c.abort();await assert.rejects(pending,{code:'TOKEN_CONTEXT_CLOSED'});
 await reject(createTokenVerifier(config()),token,{signal:c.signal});
});
test('invalid and reversing clock fail closed without exposing claims',async()=>{
 for(const clock of [()=>NaN,()=>-1,(()=>{let n=0;return()=>++n===1?1000000:999999})()])await reject(createTokenVerifier(config(clock)),await sign());
});
test('trusted JWKS is snapshotted and caller mutation does not select a key',async()=>{const c=config();const v=createTokenVerifier(c);c.jwks.keys.length=0;assert.equal((await v.verify(await sign())).kind,'VERIFIED_TOKEN_CLAIMS');});

test('clock callback closing the context at final observation cannot expose success',async()=>{
 const c=new AbortController();let calls=0;const v=createTokenVerifier(config(()=>{if(++calls===2)c.abort();return 1000000}));
 await assert.rejects(v.verify(await sign(),{signal:c.signal}),{code:'TOKEN_CONTEXT_CLOSED'});
});

for (const phase of ['initial', 'final']) test(`external ${phase} clock failures expose only a fixed classification`, async () => {
 const marker = 'offline-sensitive-error-marker';
 const failures = [
   Object.assign(new Error(marker), { code: `TOKEN_${marker}`, cause: { marker } }),
   Object.assign(new Error(marker), { code: 'TOKEN_EXPIRED' }),
   Object.assign(new Error(marker), { code: 'ERR_JWT_EXPIRED' }),
   { get code() { throw new Error(marker); }, get message() { throw new Error(marker); }, get cause() { throw new Error(marker); } },
   marker, null, Symbol(marker),
 ];
 for (const failure of failures) {
   let calls = 0;
   const verifier = createTokenVerifier(config(() => {
     if (++calls === (phase === 'initial' ? 1 : 2)) throw failure;
     return 1000000;
   }));
   const token = await sign();
   await assert.rejects(verifier.verify(token), error => {
     assert.equal(error.code, 'TOKEN_VERIFICATION_REJECTED');
     assert.equal(error.message, 'TOKEN_VERIFICATION_REJECTED');
     assert.equal(Object.hasOwn(error, 'cause'), false);
     assert.equal(JSON.stringify(error).includes(marker), false);
     assert.equal(String(error).includes(marker), false);
     return true;
   });
   assert.equal(calls, phase === 'initial' ? 1 : 2);
 }
});
