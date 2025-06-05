import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const keysDir = path.join(process.cwd(), 'keys');

if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

fs.writeFileSync(path.join(keysDir, 'private.key'), privateKey);
fs.writeFileSync(path.join(keysDir, 'public.key'), publicKey);
console.log(
  'RSA key pair generated successfully! You can find them in the "keys" directory.',
);
