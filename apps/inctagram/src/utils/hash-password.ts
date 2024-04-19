import { genSalt, hash } from "bcrypt"

export const hashPassword = async (password: string, salt?: string) => {
    try {
        if (!salt) salt = await genSalt(Number(process.env.SALT_ROUNDS) || 10)

        const passwordHash = await hash(password, salt)

        return {
            passwordHash,
            passwordSalt: salt
        }
    } catch (e) {
        console.log(e)
    }
}