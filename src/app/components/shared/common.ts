
import CryptoJS from 'crypto-js';

const secretKey = 'your-256-bit-secret';

export function encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
}

