// const crypto = require('crypto');
const config = require('../../../config/config');
var CryptoJS = require('crypto-js');


function encrypt(text) {
  return CryptoJS.AES.encrypt(text, config.secretKey).toString();
}

function decrypt(hash) {
  const bytes = CryptoJS.AES.decrypt(hash, config.secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}


// const algorithm = 'aes-256-ctr';
// const ENCRYPTION_KEY = config.secretKey; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
// const IV_LENGTH = 16;

// function encrypt(text) {
//     let iv = crypto.randomBytes(IV_LENGTH);
//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//     let textParts = text.split(':');
//     let iv = Buffer.from(textParts.shift(), 'hex');
//     let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }
module.exports = {
  encrypt,
  decrypt,
};
