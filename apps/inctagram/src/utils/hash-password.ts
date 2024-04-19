import * as crypto from 'crypto'

export const hashPassword = async (password: string, salt?: string) => {
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex');
    }

    const passwordHash = crypto.createHash('sha256').update(password + salt).digest('hex');

    return {
        passwordHash,
        passwordSalt: salt
    };

}   
