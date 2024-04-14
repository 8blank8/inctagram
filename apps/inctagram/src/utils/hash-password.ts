import { genSalt, hash } from "bcrypt"

export const hashPassword = async (password: string, salt?: string) => {
    if (!salt) salt = await genSalt(Number(process.env.SALT_ROUNDS))

    const passwordHash = await hash(password, salt)

    return {
        passwordHash,
        passwordSalt: salt
    }
}